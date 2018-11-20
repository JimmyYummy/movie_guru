const mysql = require('mysql');

// sql database setup
const connection = mysql.createConnection(process.env.MYSQL_URI);

connection.connect();

var movie_table = `CREATE TABLE Movie (
	movie_id varchar(255) NOT NULL,
	title varchar(255),
	runtime integer,
	language varchar(255),
	release_year integer,
	rating float NOT NULL,
	num_ratings integer NOT NULL,
	PRIMARY KEY(movie_id)
)`;

var movie_cast_table = `CREATE TABLE Movie_Cast (
  id varchar(255) NOT NULL,
  gender varchar(6),
  CHECK (gender = 'male' OR gender = 'female' OR gender = 'other'),
  name varchar(255),
  PRIMARY KEY(id)
)`;

var cast_in_table = `CREATE TABLE Cast_In (
	movie_id varchar(255) NOT NULL,
	cast_id varchar(255) NOT NULL,
	charac varchar(255),
	PRIMARY KEY(movie_id, cast_id),
	FOREIGN KEY (movie_id) REFERENCES Movie(movie_id),
	FOREIGN KEY (cast_id) REFERENCES Movie_Cast(id)
)`;

var crew_table = `CREATE TABLE Crew (
  id varchar(255) NOT NULL,
  gender varchar(6),
  CHECK (gender = 'male' OR gender = 'female' OR gender = 'other'),
  name varchar(255),
  PRIMARY KEY(id)
)`;

var crew_in_table = `CREATE TABLE Crew_In (
  movie_id varchar(255) NOT NULL,
	crew_id varchar(255) NOT NULL,
	job varchar(255),
	PRIMARY KEY(movie_id, crew_id),
	FOREIGN KEY (movie_id) REFERENCES Movie(movie_id),
	FOREIGN KEY (crew_id) REFERENCES Crew(id)
)`;

var keyword_table = `CREATE TABLE Keyword (
	name varchar(255) NOT NULL,
	PRIMARY KEY (name)
)`;

var movie_keyword_table = `CREATE TABLE Movie_Keyword  (
	kwd_name varchar(255) NOT NULL,
	movie_id varchar(255) NOT NULL,
	FOREIGN KEY (kwd_name) REFERENCES Keyword(name) ON DELETE CASCADE,
	FOREIGN KEY (movie_id) REFERENCES Movie(movie_id) ON DELETE CASCADE,
	PRIMARY KEY (kwd_name, movie_id)
)`;

var genre_table = `CREATE TABLE Genre(
	name varchar(255),
	PRIMARY KEY(name)
)`;

var movie_genre_table = `CREATE TABLE Movie_Genre(
	movie_id varchar(255) NOT NULL,
	genre_name varchar(255) NOT NULL,
	PRIMARY KEY(movie_id, genre_name),
	FOREIGN KEY(movie_id) REFERENCES Movie(movie_id) ON DELETE CASCADE,
	FOREIGN KEY(genre_name) REFERENCES Genre(name) ON DELETE CASCADE
)`

connection.query(movie_genre_table, function (err, result) {
  if (err) throw err;
  console.log("Table created", result);
});

connection.end();
