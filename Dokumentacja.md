# KONIECZNIE OGARNĄĆ AUTOMATYCZNE DODAWANIE PRIMARY KEY
# Trzeba ogarnąć jak zrobić wybieranie dostępnych miejsc (Można to zrobić za pomocą widoku lub funkcji)

# Bazy danych 2 Projekt

## 1. **Opis projektu**

W ramach projektu została stworzona strona kina z możliwością rejestracji, logowania się na stronie, rezerwacją i zakupem biletów na dostępne seansy.

## 2. **Schemat bazy danych**

![dbschema](img/schema.png)

## 3. **Tabele**

```sql
-- Table: Customer
CREATE TABLE Customer (
    CustomerID SERIAL NOT NULL,
    Email varchar(255) NOT NULL,
    Password varchar(255) NOT NULL,
    CONSTRAINT Customer_pk PRIMARY KEY (CustomerID)
);

-- Table: MovieCategories
CREATE TABLE MovieCategories (
    MovieCategoryID SERIAL NOT NULL,
    CategoryName varchar(40) NOT NULL,
    CONSTRAINT MovieCategories_pk PRIMARY KEY (MovieCategoryID)
);

-- Table: MovieScreening
CREATE TABLE MovieScreening (
    MovieScreeningID SERIAL NOT NULL,
    MovieID int NOT NULL,
    Date date NOT NULL,
    StartTime time NOT NULL,
    PriceStandard decimal(12,2) NOT NULL,
    PricePremium decimal(12,2) NOT NULL,
    MovieHall int NOT NULL,
    ThreeDimensional boolean NOT NULL,
    Language varchar(40) NOT NULL,
    CONSTRAINT MovieScreening_pk PRIMARY KEY (MovieScreeningID)
);

-- Table: MovieScreeningSeats
CREATE TABLE MovieScreeningSeats (
    SeatNumber int NOT NULL,
    MovieScreeningID int NOT NULL,
    Available boolean NOT NULL,
    CONSTRAINT MovieScreeningSeats_pk PRIMARY KEY (MovieScreeningID, SeatNumber)
);

-- Table: Movies
CREATE TABLE Movies (
    MovieID SERIAL NOT NULL,
    MovieCategoryID int NOT NULL,
    Title varchar(40) NOT NULL,
    StartDate date NOT NULL,
    EndDate date NOT NULL,
    Duration int NOT NULL,
    Description varchar(255) NOT NULL,
    Image bytea NOT NULL,
    Director varchar(40) NOT NULL,
    MinAge int NOT NULL,
    Production varchar(40) NOT NULL,
    OriginalLanguage varchar(40) NOT NULL,
    Rank int NOT NULL,
    CONSTRAINT Movies_pk PRIMARY KEY (MovieID)
);

-- Table: Tickets
CREATE TABLE Tickets (
    TicketID SERIAL NOT NULL,
    CustomerID int NOT NULL,
    MovieScreeningID int NOT NULL,
    SeatNumber int NOT NULL,
    OrderedOnDate date NOT NULL,
    Status char(10) NOT NULL,
    CONSTRAINT Tickets_pk PRIMARY KEY (TicketID)
);

-- foreign keys
-- Reference: MovieScreeningPlaces_MovieScreening (table: MovieScreeningSeats)
ALTER TABLE MovieScreeningSeats ADD CONSTRAINT MovieScreeningPlaces_MovieScreening
    FOREIGN KEY (MovieScreeningID)
    REFERENCES MovieScreening (MovieScreeningID)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: Session_Movies (table: MovieScreening)
ALTER TABLE MovieScreening ADD CONSTRAINT Session_Movies
    FOREIGN KEY (MovieID)
    REFERENCES Movies (MovieID)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: Tickets_MovieScreeningSeats (table: Tickets)
ALTER TABLE Tickets ADD CONSTRAINT Tickets_MovieScreeningSeats
    FOREIGN KEY (MovieScreeningID, SeatNumber)
    REFERENCES MovieScreeningSeats (MovieScreeningID, SeatNumber)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: client_purchase (table: Tickets)
ALTER TABLE Tickets ADD CONSTRAINT client_purchase
    FOREIGN KEY (CustomerID)
    REFERENCES Customer (CustomerID)
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

- Widok pokazujący wszystkie dostępne filmy wraz z kategoriami.

```postgresql
CREATE VIEW all_movies as
SELECT *
From movies m
         JOIN moviecategories mc on m.moviecategoryid = mc.moviecategoryid
```

- Widok pokazujący wszystkie dostępne filmy i ich szczegóły.

```postgresql
CREATE VIEW available_movies as
SELECT *
From movies m
         JOIN moviecategories mc on m.moviecategoryid = mc.moviecategoryid
WHERE m.startdate <= current_date
  and m.enddate >= current_date

```

- Widok pokazujący dostępne miejsca na seans o ID = MovieScreeningID:

```postgresql
CREATE VIEW available_seats as
SELECT ms.moviescreeningid, msc.seatnumber
From moviescreening ms
         JOIN moviescreeningseats msc on ms.moviescreeningid = msc.moviescreeningid
WHERE available = TRUE
```

## 5. **Procedury**

- AddCustomer:

```postgresql
CREATE OR REPLACE PROCEDURE AddCustomer(p_email Varchar(255), p_password Varchar(255))
    LANGUAGE plpgsql
AS
$$
BEGIN
    INSERT INTO Customer(email, password) values (p_email, p_password);
END;
$$;
```

- RemoveCustomer:

```postgresql
CREATE OR REPLACE PROCEDURE RemoveCustomer(
    p_CustomerID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM Customer WHERE CustomerID = p_CustomerID;
END;
$$;
```
- ChangeCustomer:

```postgresql
CREATE OR REPLACE PROCEDURE ChangeCustomer(
    p_CustomerID INT,
    p_Email VARCHAR(255),
    p_Password VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Customer SET Email = p_Email, Password = p_Password WHERE CustomerID = p_CustomerID;
END;
$$;
```

- ChangeCustomerPassword:

```postgresql
CREATE OR REPLACE PROCEDURE ChangeCustomer(
    p_CustomerID INT,
    p_Password VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Customer SET Password = p_Password WHERE CustomerID = p_CustomerID;
END;
$$;
```

W AddTicket nie sprawdzamy czy miejsce jest wolne ponieważ miejsce nie będzie dostępne ze schematu. Fajnie dodać trriger
który robi update movescreeningseats


- AddTicket:

```postgresql
CREATE OR REPLACE PROCEDURE AddTicket(p_customerID INT, p_movieScreeningID INT, p_seatNumber INT, p_orderedOnDate DATE,
                                      p_status CHAR(5))
    LANGUAGE plpgsql
AS
$$
BEGIN
    INSERT INTO Tickets(customerid, moviescreeningid, seatnumber, orderedondate, status)
    values (p_customerID, p_movieScreeningID, p_seatNumber, p_orderedOnDate, p_status);

    UPDATE moviescreeningseats
    SET available = False
    WHERE moviescreeningid = p_movieScreeningID
      and seatnumber = p_seatNumber;
END;
$$
```

- RemoveTicket:

```postgresql
CREATE OR REPLACE PROCEDURE RemoveTicket(
    p_TicketID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM Tickets WHERE TicketID = p_TicketID;
END;
$$;
```

- AddMovieCategory:

```postgresql
CREATE OR REPLACE PROCEDURE AddMovieCategory(
    p_CategoryName VARCHAR(40)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO MovieCategories (CategoryName) VALUES (p_CategoryName);
END;
$$;
```

- RemoveMovieCategory:

```postgresql
CREATE OR REPLACE PROCEDURE RemoveMovieCategory(
    p_MovieCategoryID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM MovieCategories WHERE MovieCategoryID = p_MovieCategoryID;
END;
$$;
```

- AddMovieSreening:

```postgresql
CREATE OR REPLACE PROCEDURE AddMovieScreening(
    p_MovieID INT,
    p_Date DATE,
    p_StartTime TIME,
    p_PriceStandard DECIMAL(12,2),
    p_PricePremium DECIMAL(12,2),
    p_MovieHall INT,
    p_ThreeDimensional BOOLEAN,
    p_Language VARCHAR(40)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO MovieScreening (MovieID, Date, StartTime, PriceStandard, PricePremium, MovieHall, ThreeDimensional, Language)
    VALUES (p_MovieID, p_Date, p_StartTime, p_PriceStandard, p_PricePremium, p_MovieHall, p_ThreeDimensional, p_Language);
END;
$$;
```

- RemoveMovieScreening:

```postgresql
CREATE OR REPLACE PROCEDURE RemoveMovieScreening(
    p_MovieScreeningID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM MovieScreening WHERE MovieScreeningID = p_MovieScreeningID;
END;
$$;
```

Dodać trzeba, że jak tworzymy oraz usuwamy MovieScreening to automatycznie dodajemy oraz usuwamy wszystkie miejsca do AddMovieScreningSeat (zapewne jakis trigger)

- MovieScreeningSeats:

```postgresql
CREATE OR REPLACE PROCEDURE AddMovieScreeningSeat(
    p_SeatNumber INT,
    p_MovieScreeningID INT,
    p_Available BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO MovieScreeningSeats (SeatNumber, MovieScreeningID, Available)
    VALUES (p_SeatNumber, p_MovieScreeningID, p_Available);
END;
$$;
```

- AddMovie:

```postgresql
CREATE OR REPLACE PROCEDURE AddMovie(
    p_MovieCategoryID INT,
    p_Title VARCHAR(40),
    p_StartDate DATE,
    p_EndDate DATE,
    p_Duration INT,
    p_Description VARCHAR(255),
    p_Image BYTEA,
    p_Director VARCHAR(40),
    p_MinAge INT,
    p_Production VARCHAR(40),
    p_OriginalLanguage VARCHAR(40),
    p_Rank INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Movies (MovieCategoryID, Title, StartDate, EndDate, Duration, Description, Image, Director, MinAge, Production, OriginalLanguage, Rank)
    VALUES (p_MovieCategoryID, p_Title, p_StartDate, p_EndDate, p_Duration, p_Description, p_Image, p_Director, p_MinAge, p_Production, p_OriginalLanguage, p_Rank);
END;
$$;
```

- RemoveMovie:

```postgresql
CREATE OR REPLACE PROCEDURE RemoveMovie(
    p_MovieID INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM Movies WHERE MovieID = p_MovieID;
END;
$$;
```

## 6. **Funkcje**

GetMovieDetails:

```postgresql
CREATE OR REPLACE FUNCTION GetMovieDetails(p_title VARCHAR(40))
RETURNS TABLE (
    MovieID INT,
    MovieCategoryID INT,
    Title VARCHAR(40),
    StartDate DATE,
    EndDate DATE,
    Duration INT,
    Description VARCHAR(255),
    Director VARCHAR(30),
    MinAge INT,
    Production VARCHAR(30),
    OriginalLanguage VARCHAR(30),
    Rank INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT MovieID, MovieCategoryID, Title, StartDate, EndDate, Duration, Description, Director, MinAge, Production, OriginalLanguage, Rank
    FROM Movies
    WHERE title = p_title;
END;
$$;
```

- HasActiveTickets:

```postgresql
CREATE OR REPLACE FUNCTION HasActiveTickets(p_CustomerID INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    active_count INT;
BEGIN
    SELECT COUNT(*)
    INTO active_count
    FROM Tickets
    WHERE CustomerID = p_CustomerID AND Status = 'active';

    IF active_count > 0 THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$;
```

## 7. **Triggery**


## 8. **Indeksy**

Indeks dla szybszego wyszukiwania seansów filmowych według daty i godziny.

```postgresql
CREATE INDEX idx_movie__screening_date_time on MovieScreening (Date, StartTime);
```

Indeks dla szybszego wyszukiwania dostępnych miejsc na seansie.

```postgresql
CREATE INDEX idx_movie_screening_seats_avail on moviescreeningseats (moviescreeningid, available);
```

## 9. **Widoki strony internetowej**