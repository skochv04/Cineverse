# KONIECZNIE OGARNĄĆ AUTOMATYCZNE DODAWANIE PRIMARY KEY
# Trzeba ogarnąć jak zrobić wybieranie dostępnych miejsc (Można to zrobić za pomocą widoku lub funkcji)

# Bazy danych 2 Projekt

## 1. **Opis projektu**

W ramach projektu została stworzona strona kina z możliwością rejestracji, logowania się na stronie, rezerwacją i zakupem biletów na dostępne seansy.

## 2. **Schemat bazy danych**

![dbschema](img/schema.png)

## 3. **Tabele**

```sql
-- Table: MovieCategories
CREATE TABLE MovieCategories (
    MovieCategoryID int  NOT NULL,
    CategoryName varchar(40)  NOT NULL,
    CONSTRAINT MovieCategories_pk PRIMARY KEY (MovieCategoryID)
);

-- Table: MovieHalls
CREATE TABLE movie_halls (
    MovieHallID serial PRIMARY KEY,
    hall_number INTEGER NOT NULL
);

-- Table: movie_screening
CREATE TABLE movie_screening (
    MovieScreeningID serial  NOT NULL,
    MovieID int  NOT NULL,
    Date date  NOT NULL,
    StartTime time  NOT NULL,
    EndTime time  NOT NULL,
    PriceStandard decimal(12,2)  NOT NULL,
    PricePremium decimal(12,2)  NOT NULL,
    ThreeDimensional boolean  NOT NULL,
    Language varchar(40)  NOT NULL,
    HallNumber int  NOT NULL,
    CONSTRAINT movie_screening_pk PRIMARY KEY (MovieScreeningID)
);

-- Table: hall_seats
CREATE TABLE hall_seats (
    SeatID serial  NOT NULL,
    SeatNumber int  NOT NULL,
    MovieHallNumber int  NOT NULL,
    CONSTRAINT hall_seats_pk PRIMARY KEY (SeatID)
);

-- Table: Movies
CREATE TABLE Movies (
    MovieID int  NOT NULL,
    MovieCategoryID int  NOT NULL,
    Title varchar(40)  NOT NULL,
    StartDate date  NOT NULL,
    EndDate date  NOT NULL,
    Duration int  NOT NULL,
    Description varchar(255)  NOT NULL,
    Image bytea  NOT NULL,
    Director varchar(40)  NOT NULL,
    MinAge int  NOT NULL,
    Production varchar(40)  NOT NULL,
    OriginalLanguage varchar(40)  NOT NULL,
    Rank double precision NOT NULL,
    CONSTRAINT Movies_pk PRIMARY KEY (MovieID)
);

-- Table: tickets
CREATE TABLE tickets (
    TickedID serial  NOT NULL,
    CustomerID int  NOT NULL,
    OrderedOnDate date  NOT NULL,
    OrderedOnTime time  NOT NULL,
    Status char(10)  NOT NULL,
    MovieScreeningID int  NOT NULL,
    SeatNumber int  NOT NULL,
    CONSTRAINT tickets_pk PRIMARY KEY (TickedID)
);

-- foreign keys
-- Reference: HallSeats_MovieHalls (table: hall_seats)
ALTER TABLE hall_seats ADD CONSTRAINT HallSeats_MovieHalls
    FOREIGN KEY (MovieHallNumber)
    REFERENCES movie_halls (MovieHallNumber)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: Session_Movies (table: movie_screening)
ALTER TABLE movie_screening ADD CONSTRAINT Session_Movies
    FOREIGN KEY (MovieID)
    REFERENCES movies (MovieID)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: Tickets_HallSeats (table: tickets)
ALTER TABLE tickets ADD CONSTRAINT Tickets_HallSeats
    FOREIGN KEY (SeatNumber)
    REFERENCES hall_seats (SeatID)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: Tickets_MovieScreening (table: tickets)
ALTER TABLE tickets ADD CONSTRAINT Tickets_MovieScreening
    FOREIGN KEY (MovieScreeningID)
    REFERENCES movie_screening (MovieScreeningID)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: client_purchase (table: tickets)
ALTER TABLE tickets ADD CONSTRAINT client_purchase
    FOREIGN KEY (CustomerID)
    REFERENCES user_api_appuser (user_id)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: product_category_product (table: Movies)
ALTER TABLE Movies ADD CONSTRAINT product_category_product
    FOREIGN KEY (MovieCategoryID)
    REFERENCES MovieCategories (MovieCategoryID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;
```

## 4. **Widoki**

- Wyświetlenie danych o wszystkich zajętych miejscach na określony seans

```postgresql
CREATE OR REPLACE VIEW occupied_seats AS
SELECT
    row_number() OVER (ORDER BY tickets.moviescreeningid, seatnumber) AS id,
    SeatNumber,
    HallNumber,
    Tickets.MovieScreeningID
FROM
    tickets
INNER JOIN
    movie_screening
ON
    tickets.MovieScreeningID = movie_screening.MovieScreeningID;
```

## 5. **Procedury**

- Rezerwacja miejsca na określony seans

```postgresql
CREATE OR REPLACE PROCEDURE reserve_movie_screening_seat(
    IN p_customer_id INTEGER,
    IN p_seat_number INTEGER,
    IN p_movie_screening_id INTEGER,
    IN p_curr_date date,
    IN p_curr_time time
)
    LANGUAGE plpgsql
AS
$$
BEGIN
    IF exists(select *
              from occupied_seats as oc
              where oc.MovieScreeningID = p_movie_screening_id and oc.seatnumber = p_seat_number) THEN
        RAISE EXCEPTION 'The place has been already occupied';
    END IF;
    INSERT INTO tickets (customerid, moviescreeningid, seatnumber, orderedondate, orderedontime, status)
    VALUES (p_customer_id, p_movie_screening_id, p_seat_number, p_curr_date, p_curr_time, 'New');
END;
$$;
```

- Zakup miejsca na określony seans

```postgresql
CREATE OR REPLACE PROCEDURE buy_movie_screening_seat(
    IN p_customer_id INTEGER,
    IN p_seat_number INTEGER,
    IN p_movie_screening_id INTEGER,
    IN p_curr_date date,
    IN p_curr_time time
)
    LANGUAGE plpgsql
AS
$$
BEGIN
    IF exists(select *
              from occupied_seats as oc
              where oc.MovieScreeningID = p_movie_screening_id and oc.seatnumber = p_seat_number) THEN
        RAISE EXCEPTION 'The place has been already occupied';
    END IF;
    INSERT INTO tickets (customerid, moviescreeningid, seatnumber, orderedondate, orderedontime, status)
    VALUES (p_customer_id, p_movie_screening_id, p_seat_number, p_curr_date, p_curr_time, 'Confirmed');
END;
$$;
```

- Dodawanie nowej kategorii

```postgresql
CREATE PROCEDURE add_movie_category(
    IN p_categoryname varchar(40)
)
LANGUAGE plpgsql
AS
$$
BEGIN
    -- Insert new category into movie_categories table
    INSERT INTO movie_categories (categoryname)
    VALUES (p_categoryname);
END;
$$;

ALTER PROCEDURE add_movie_category(varchar(40)) OWNER TO postgres;
```

- Usunięcie danej kategorii pod warunkiem, że żaden movie do niej nie należy

```postgresql
CREATE OR REPLACE PROCEDURE delete_movie_category(IN p_categoryname varchar)
LANGUAGE plpgsql
AS
$$
DECLARE
    v_moviecategoryid integer;
BEGIN
    SELECT moviecategoryid INTO v_moviecategoryid
    FROM movie_categories
    WHERE categoryname = p_categoryname;

    IF v_moviecategoryid IS NULL THEN
        RAISE EXCEPTION 'Category with name % does not exist', p_categoryname;
    END IF;

    IF EXISTS (SELECT 1 FROM movies WHERE moviecategoryid = v_moviecategoryid) THEN
        RAISE EXCEPTION 'Cannot delete category because there are movies associated with it';
    END IF;

    DELETE FROM movie_categories
    WHERE moviecategoryid = v_moviecategoryid;
END;
$$;

ALTER PROCEDURE delete_movie_category(varchar) OWNER TO postgres;
```

- Dodawanie nowego movie

```postgresql
CREATE PROCEDURE add_movie_by_name(
    IN p_moviecategoryname character varying,
    IN p_title character varying,
    IN p_startdate date,
    IN p_enddate date,
    IN p_duration integer,
    IN p_description character varying,
    IN p_image bytea,
    IN p_director character varying,
    IN p_minage integer,
    IN p_production character varying,
    IN p_originallanguage character varying,
    IN p_rank double precision
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_category_id INTEGER;
BEGIN
    -- Get movie category id from category name
    SELECT moviecategoryid INTO v_category_id FROM movie_categories WHERE categoryname = p_moviecategoryname;

    -- Check if category id is NULL, which means no matching category found
    IF v_category_id IS NULL THEN
        RAISE EXCEPTION 'Movie category % does not exist', p_moviecategoryname;
    END IF;

    -- Check if enddate is greater than startdate
    IF p_enddate <= p_startdate THEN
        RAISE EXCEPTION 'End date must be greater than start date';
    END IF;

    -- Check if duration is at least 30 minutes
    IF p_duration < 30 THEN
        RAISE EXCEPTION 'Duration must be at least 30 minutes';
    END IF;

    -- Check if rank is between 0 and 10
    IF p_rank < 0 OR p_rank > 10 THEN
        RAISE EXCEPTION 'Rank must be between 0 and 10';
    END IF;

    -- Check if minage is between 0 and 21
    IF p_minage < 0 OR p_minage > 21 THEN
        RAISE EXCEPTION 'Minimum age must be between 0 and 21';
    END IF;

    -- Insert the new movie into the movies table
    INSERT INTO movies (
        moviecategoryid, title, startdate, enddate, duration, description,
        image, director, minage, production, originallanguage, rank
    ) VALUES (
        v_category_id, p_title, p_startdate, p_enddate, p_duration, p_description,
        p_image, p_director, p_minage, p_production, p_originallanguage, p_rank
    );
END;
$$;

ALTER PROCEDURE add_movie_by_name(character varying, varchar, date, date, integer, varchar, bytea, varchar, integer, varchar, varchar, double precision) OWNER TO postgres;
```

- Zmiana danzch danego movie

```postgresql
CREATE OR REPLACE PROCEDURE update_movie_by_name(
    IN p_movie_title character varying,
    IN p_moviecategoryname character varying,
    IN p_title character varying,
    IN p_startdate date,
    IN p_enddate date,
    IN p_duration integer,
    IN p_description character varying,
    IN p_image bytea,
    IN p_director character varying,
    IN p_minage integer,
    IN p_production character varying,
    IN p_originallanguage character varying,
    IN p_rank double precision
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_movie_id INTEGER;
    v_category_id INTEGER;
BEGIN
    -- Get movie ID from title
    SELECT movieid INTO v_movie_id FROM movies WHERE title = p_movie_title;

    -- Check if movie with the given title exists
    IF v_movie_id IS NULL THEN
        RAISE EXCEPTION 'Movie with title % does not exist', p_movie_title;
    END IF;

    -- Get movie category id from category name
    SELECT moviecategoryid INTO v_category_id FROM movie_categories WHERE categoryname = p_moviecategoryname;

    -- Check if category name exists
    IF v_category_id IS NULL THEN
        RAISE EXCEPTION 'Movie category % does not exist', p_moviecategoryname;
    END IF;

    -- Check if end date is greater than start date
    IF p_enddate <= p_startdate THEN
        RAISE EXCEPTION 'End date must be greater than start date';
    END IF;

    -- Check if duration is at least 30 minutes
    IF p_duration < 30 THEN
        RAISE EXCEPTION 'Duration must be at least 30 minutes';
    END IF;

    -- Check if rank is between 0 and 10
    IF p_rank < 0 OR p_rank > 10 THEN
        RAISE EXCEPTION 'Rank must be between 0 and 10';
    END IF;

    -- Check if minage is between 0 and 21
    IF p_minage < 0 OR p_minage > 21 THEN
        RAISE EXCEPTION 'Minimum age must be between 0 and 21';
    END IF;

    -- Update the movie information
    UPDATE movies
    SET
        moviecategoryid = v_category_id,
        title = p_title,
        startdate = p_startdate,
        enddate = p_enddate,
        duration = p_duration,
        description = p_description,
        image = p_image,
        director = p_director,
        minage = p_minage,
        production = p_production,
        originallanguage = p_originallanguage,
        rank = p_rank
    WHERE
        movieid = v_movie_id;
END;
$$;

ALTER PROCEDURE update_movie_by_name(character varying, character varying, varchar, date, date, integer, varchar, bytea, varchar, integer, varchar, varchar, double precision) OWNER TO postgres;

```

- Usunięcie danego movie

```postgresql
CREATE OR REPLACE PROCEDURE delete_movie_by_name(IN p_movie_title TEXT)
LANGUAGE plpgsql
AS
$$
BEGIN
    -- Check if movie with the given name exists
    IF NOT EXISTS (SELECT 1 FROM movies WHERE title = p_movie_title) THEN
        RAISE EXCEPTION 'Movie with name % does not exist', p_movie_title;
    END IF;

    -- Delete the movie
    DELETE FROM movies
    WHERE title = p_movie_title;
END;
$$;
```

- Dodawanie nowego seansu

```postgresql
CREATE OR REPLACE PROCEDURE add_movie_screening(
    IN title_val character varying,
    IN date_val date,
    IN start_time_val time without time zone,
    IN price_standard_val numeric,
    IN price_premium_val numeric,
    IN is_3d boolean,
    IN language_val character varying,
    IN hall_val integer
)
LANGUAGE plpgsql
AS
$$
DECLARE
    movie_id integer;
    duration_val int;
    end_time_val time;
    hall_available boolean;
BEGIN
    -- Retrieve the movie_id and duration based on the title
    SELECT m.movieid, m.duration INTO movie_id, duration_val
    FROM movies m
    WHERE m.title = title_val
    AND date_val BETWEEN m.startdate AND m.enddate; -- Check if date_val is between startdate and enddate of the movie

    -- Check if the movie exists
    IF movie_id IS NULL THEN
        RAISE EXCEPTION 'Movie with title % does not exist or is not available on the specified date', title_val;
    END IF;

    -- Check if the movie hall exists
    IF NOT EXISTS (SELECT 1 FROM movie_halls WHERE hall_number = hall_val) THEN
        RAISE EXCEPTION 'Movie hall with id % does not exist', hall_val;
    END IF;

    -- Calculate the end time of the screening
    SELECT calculate_end_time(start_time_val, duration_val) INTO end_time_val;

    -- Check if the movie hall is available
    hall_available := is_moviehall_available(hall_val, date_val, start_time_val, end_time_val);
    IF NOT hall_available THEN
        RAISE EXCEPTION 'Movie hall with id % is not available for the specified time and date', hall_val;
    END IF;

    -- Insert the new movie screening record
    INSERT INTO movie_screening (movieid, date, starttime, endtime, pricestandard, pricepremium, threedimensional, language, hallnumber)
    VALUES (movie_id, date_val, start_time_val, end_time_val, price_standard_val, price_premium_val, is_3d, language_val, hall_val);
END
$$;

ALTER PROCEDURE add_movie_screening(varchar, date, time, numeric, numeric, boolean, varchar, integer) OWNER TO postgres;
```

- Usunięcie danego seansu

```postgresql
CREATE OR REPLACE PROCEDURE delete_movie_screening(
    IN movie_title TEXT,
    IN screening_date DATE,
    IN screening_time TIME)
LANGUAGE plpgsql
AS
$$
DECLARE
    screening_id INTEGER;
BEGIN
    -- Перевірка наявності показу фільму з заданими параметрами
    SELECT ms.moviescreeningid
    INTO screening_id
    FROM movie_screening ms
    JOIN movies m ON ms.movieid = m.movieid
    WHERE m.title = movie_title
      AND ms.date = screening_date
      AND ms.starttime = screening_time;

    -- Якщо показ не знайдено, викликаємо помилку
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No movie screening for the movie "%", date "%", and time "%" exists', movie_title, screening_date, screening_time;
    END IF;

    -- Видалення знайденого показу
    DELETE FROM movie_screening
    WHERE moviescreeningid = screening_id;
END
$$;

ALTER PROCEDURE delete_movie_screening(TEXT, DATE, TIME) OWNER TO postgres;
```

- Cykliczne dodawanie seansów dla filmu na tą samą godzinę i tą samą salę na 7 kolejnych dni od zadangeo

```postgresql
CREATE OR REPLACE PROCEDURE add_movie_screenings_weekly(
    IN movie_title character varying,
    IN start_date date,
    IN start_time time without time zone,
    IN price_standard numeric,
    IN price_premium numeric,
    IN is_3d boolean,
    IN language_val character varying,
    IN hall_number integer,
    IN repeat_count integer
)
LANGUAGE plpgsql
AS
$$
DECLARE
    movie_id integer;
    current_date_val date := start_date;
    iteration integer := 1;
BEGIN
    -- Retrieve the movie_id based on the title
    SELECT movieid INTO movie_id
    FROM movies
    WHERE title = movie_title;

    -- Check if the movie exists
    IF movie_id IS NULL THEN
        RAISE EXCEPTION 'Movie with title % does not exist', movie_title;
    END IF;

    -- Check if the repeat_count is within the valid range
    IF repeat_count < 1 OR repeat_count > 14 THEN
        RAISE EXCEPTION 'Repeat count % is out of the valid range (1-14)', repeat_count;
    END IF;

    -- Loop to add movie screenings for the specified number of repeat days
    WHILE iteration <= repeat_count LOOP
        CALL add_movie_screening(
            movie_id,
            current_date_val,
            start_time,
            price_standard,
            price_premium,
            is_3d,
            language_val,
            hall_number
        );

        -- Move to the next day
        current_date_val := current_date_val + 1;
        iteration := iteration + 1;
    END LOOP;
END;
$$;

ALTER PROCEDURE add_movie_screenings_weekly(varchar, date, time, numeric, numeric, boolean, varchar, integer, integer) OWNER TO postgres;
```

- Zmiana statusu ticketa

```postgersql
CREATE OR REPLACE PROCEDURE update_ticket_status(
    IN p_ticket_id INTEGER,
    IN p_new_status CHAR(10)
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Checking the current status of the ticket
    DECLARE
        v_current_status CHAR(10);
    BEGIN
        SELECT status INTO v_current_status
        FROM tickets
        WHERE ticketid = p_ticket_id;

        -- If the current status of the ticket is "Confirmed", do not change it
        IF v_current_status = 'Confirmed' THEN
            RAISE NOTICE 'The ticket status is confirmed and cannot be changed.';
            RETURN;
        END IF;

        -- If the current status of the ticket is "New", allow changing it to "Canceled" or "Confirmed"
        IF v_current_status = 'New' THEN
            IF p_new_status = 'Canceled' OR p_new_status = 'Confirmed' THEN
                UPDATE tickets
                SET status = p_new_status
                WHERE ticketid = p_ticket_id;
                RAISE NOTICE 'Ticket status successfully updated to %.', p_new_status;
            ELSE
                RAISE NOTICE 'The ticket status can only be changed to "Canceled" or "Confirmed".';
            END IF;
        END IF;
    END;
END;
$$;
```

## 6. **Funkcje**

- Wyświetlenie wszystkich seansów dla danego movie, które są grane po wskazywanym terminie

```postgresql
create function get_movie_sessions(p_title character varying, target_date date, target_time time without time zone)
    returns TABLE(moviescreeningid integer, movieid integer, date date, starttime time without time zone, pricestandard numeric, pricepremium numeric, moviehall integer, threedimensional boolean, language character varying)
    language plpgsql
as
$$
BEGIN
    RETURN QUERY
    SELECT
        movie_screening.moviescreeningid,
        movie_screening.movieid,
        movie_screening.date,
        movie_screening.starttime,
        movie_screening.pricestandard,
        movie_screening.pricepremium,
        movie_screening.hallnumber,
        movie_screening.threedimensional,
        movie_screening.language
    FROM
        movie_screening
    INNER JOIN
        movies as m on movie_screening.MovieID = m.movieid
    WHERE
        m.title = get_movie_sessions.p_title
        AND (movie_screening.date > get_movie_sessions.target_date
            OR (movie_screening.date >= get_movie_sessions.target_date AND movie_screening.starttime > get_movie_sessions.target_time));
END;
$$;
```

- Wyświetlenie wszystkich zajętych miejsc dla danego seansu

```postgresql
CREATE OR REPLACE FUNCTION get_occupied_seats(screening_id integer)
    RETURNS TABLE(seat_number integer)
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT
        seatnumber AS seat_number
    FROM
        occupied_seats
    WHERE
        moviescreeningid = get_occupied_seats.screening_id;
END;
$$;

ALTER FUNCTION get_occupied_seats(integer) OWNER TO postgres;
```

- Wyświetlenie wszystkich filmów aktualnie granych w kinie

```postrgresql
create function get_current_movies(p_date date)
    returns TABLE(movieid integer, moviecategoryid integer, title character varying, startdate date, enddate date, duration integer, description character varying, image bytea, director character varying, minage integer, production character varying, originallanguage character varying, rank double precision)
    language plpgsql
as
$$
BEGIN
    RETURN QUERY
    SELECT
        m.movieid,
        m.moviecategoryid,
        m.title,
        m.startdate,
        m.enddate,
        m.duration,
        m.description,
        m.image,
        m.director,
        m.minage,
        m.production,
        m.originallanguage,
        m.rank
    FROM
        movies m
    WHERE
        m.startdate <= p_date and p_date <= m.enddate;
END;
$$;

alter function get_current_movies(date) owner to postgres;
```

- Wyświetlenie wszystkich filmów, które będą grane w przyszłości

```postgresql
create function get_upcoming_movies(p_date date)
    returns TABLE(movieid integer, moviecategoryid integer, title character varying, startdate date, enddate date, duration integer, description character varying, image bytea, director character varying, minage integer, production character varying, originallanguage character varying, rank double precision)
    language plpgsql
as
$$
BEGIN
    RETURN QUERY
    SELECT
        m.movieid,
        m.moviecategoryid,
        m.title,
        m.startdate,
        m.enddate,
        m.duration,
        m.description,
        m.image,
        m.director,
        m.minage,
        m.production,
        m.originallanguage,
        m.rank
    FROM
        movies m
    WHERE
        p_date < m.startdate;
END;
$$;

alter function get_upcoming_movies(date) owner to postgres;
```

- Sprawdzenie, czy sala jest dostępna w określonym terminie

```postgresql
CREATE OR REPLACE FUNCTION is_moviehall_available(IN hall_val integer, IN date_val date, IN start_time_val time without time zone, IN end_time_val time without time zone)
RETURNS boolean AS
$$
DECLARE
    is_available boolean;
BEGIN
    SELECT NOT EXISTS (
        SELECT 1 FROM movie_screening
        WHERE hallnumber = hall_val
        AND date = date_val
        AND (starttime <= end_time_val AND endtime >= start_time_val)
    ) INTO is_available;

    RETURN is_available;
END;
$$
LANGUAGE plpgsql;
```

- Obliczanie end_time dla seansu

```postgresql
CREATE OR REPLACE FUNCTION calculate_end_time(start_time_param TIME, duration_param INTEGER)
RETURNS TIME AS
$$
DECLARE
    end_time_result TIME;
BEGIN
    SELECT (start_time_param + INTERVAL '1 minute' * duration_param) INTO end_time_result;
    RETURN end_time_result;
END;
$$ LANGUAGE plpgsql;
```

- Wyświetlenie terminów wszystkich seansów prowadzonych w danej sali

```postgresql
CREATE OR REPLACE FUNCTION get_screenings_by_hall(hall_number_param INTEGER)
RETURNS TABLE (
    movieid INTEGER,
    starttime TIME,
    endtime TIME
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        ms.movieid,
        ms.starttime,
        ms.endtime
    FROM
        movie_screening ms
    WHERE
        ms.hallnumber = hall_number_param
    ORDER BY
        ms.starttime;
END;
$$ LANGUAGE plpgsql;
```

- Wyświetlenie wszystkich biletów dla danego użytkownika

```postgresql
create function get_tickets_for_user(user_id integer)
    returns TABLE(ticket_id integer, status char(10), date date, title varchar(40), start_time time without time zone, duration integer, hall_number integer, sit_number integer, price numeric, ordered_on_date date, ordered_on_time time without time zone)
    language plpgsql
as
$$
begin
    return query
    select
        t.ticketid,
        t.status,
        ms.Date,
        m.title,
        ms.StartTime,
        m.duration,
        ms.hallnumber,
        t.seatnumber,
        CASE
            WHEN is_premium_place(t.seatnumber) THEN ms.PricePremium
            ELSE ms.PriceStandard
        END AS price,
        t.orderedondate,
        t.orderedontime
    from
        tickets t
    inner join
        movie_screening as ms on t.MovieScreeningID = ms.MovieScreeningID
    inner join
        movies as m on m.movieid = ms.movieid
    where
        t.customerid = user_id
    order by date, starttime;
end;
$$;

alter function get_tickets_for_user(integer) owner to postgres;
```

- Sprawdzenie, czy dane miejsce jest mejscem z kategorii Premium (wszystkie sale mają tyle samo miejsc, ostatni rząd symbolizuje premium mejsca)

```postgresql
create function is_premium_place(place_value integer) returns boolean
    language plpgsql
as
$$
BEGIN
    IF place_value >= 1 AND place_value <= 11 THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$;

alter function is_premium_place(integer) owner to postgres;
```

- Wyświetlenie danych o filmu wraz z nazwą kategorii

```postgresql

create function get_movie_by_title(p_title character varying)
    returns TABLE(movieid integer, moviecategoryid integer, title character varying, startdate date, enddate date, duration integer, description character varying, image bytea, director character varying, minage integer, production character varying, originallanguage character varying, rank double precision)
    language plpgsql
as
$$
BEGIN
    RETURN QUERY
    SELECT
        m.movieid,
        mc.categoryname,
        m.title,
        m.startdate,
        m.enddate,
        m.duration,
        m.description,
        m.image,
        m.director,
        m.minage,
        m.production,
        m.originallanguage,
        m.rank
    FROM
        movies m
    INNER JOIN
        movie_categories as mc
    on m.moviecategoryid = mc.moviecategoryid
    WHERE p_title = m.title;
END;
$$;

alter function get_movie_by_title(varchar) owner to postgres;
```

## 7. **Triggery**

- Zabronienie rezerwacji na seans który jest grany w najbliższe 2 godziny (możliwy jest wyłącznie zakup biletu na taki seans)

```postgresql
CREATE OR REPLACE FUNCTION check_reservation_period()
    RETURNS TRIGGER AS
$$
DECLARE
    screening_date DATE;
    screening_start_time TIME;
BEGIN
    SELECT date, starttime
    INTO screening_date, screening_start_time
    FROM movie_screening
    WHERE MovieScreeningID = NEW.MovieScreeningID;

    IF NEW.Status = 'New' and (screening_date + screening_start_time) <= (NEW.OrderedOnDate + NEW.OrderedOnTime + interval '2 hours') THEN
        RAISE EXCEPTION 'The movie screening must be later than 2 hours from the reservation time';
    END IF;

    RETURN NEW;
END;
$$ language plpgsql;
```

```postgresql
CREATE TRIGGER validate_reservation_time
    BEFORE INSERT
    ON tickets
    FOR EACH ROW
EXECUTE FUNCTION check_reservation_period();
```

## 8. **Indeksy**

## 9. **Widoki strony internetowej**