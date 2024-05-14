1. Widoki

Widok pokazujący wszystkie dostępne filmy wraz z kategoriami.

```postgresql
CREATE VIEW all_movies as
    SELECT *
    From movies m
    JOIN moviecategories mc on m.moviecategoryid = mc.moviecategoryid
```

Widok pokazujący wszystkie dostępne filmy i ich szczegóły.

```postgresql
CREATE VIEW available_movies as
    SELECT *
    From movies m
    JOIN moviecategories mc on m.moviecategoryid = mc.moviecategoryid
    WHERE m.startdate <= current_date and m.enddate >= current_date

```

Widok pokazujący dostępne miejsca na seans o ID = MovieScreeningID:
```postgresql
CREATE VIEW available_seats as
    SELECT ms.moviescreeningid, msc.seatnumber
    From moviescreening ms
    JOIN moviescreeningseats msc on ms.moviescreeningid = msc.moviescreeningid
    WHERE available = TRUE
```





2. Funkcje

```postgresql

```




3. Procedury





4. Triggery 





5. Indeksy 

Indeks dla szybszego wyszukiwania seansów filmowych według daty i godziny.

```postgresql
CREATE INDEX idx_movie__screening_date_time on MovieScreening(Date, StartTime);
```

Indeks dla szybszego wyszukiwania dostępnych miejsc na seansie.

```postgresql
CREATE INDEX idx_movie_screening_seats_avail on moviescreeningseats(moviescreeningid, available);
```
