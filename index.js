const express = require("express");
const app = express();
const port = 3000;
const { db } = require("./conf");
app.get("/", (request, response) => {
  response.send("Bienvenue sur Express");
});

//quête express 1
// //Une route /api/movies qui renvoie un string
// app.get(`/api/movies`, (req, res) => {
//   res.send("Recherche validée");
// });
// //Une route /api/movies/<id du film> qui renvoie un JSON
// app.get(`/api/movies/:id`, (req, res) => {
//   res.json({ id: req.params.id });
// });
// //Une route /api/employee?name=<nom de l'employé> qui renvoie un statut 404 et un string
// app.get(`/api/employee`, (req, res) => {
//   const name = req.query.name;
//   res.status(404).send(`Impossible de récupérer l'employé ${name}`);
// });
// //une route /api/employee/ qui renvoie un statut 304
// app.get(`/api/employee`, (req, res) => {
//   res.sendStatus(304);
// });

//1 GET * tous les éléments de la table

// écoute de l'url "/api/character"
app.get("/api/allcharacters", (req, res) => {
  // connection à la base de données, et sélection de toutes les données de la table
  db.query("SELECT * FROM people ORDER BY birthday ASC", (err, results) => {
    // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
    if (err) {
      res.status(500).send("Erreur lors de la récupération des personnages");
    } else {
      // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON.
      res.json(results);
    }
  });
});

//2 GET id, lastname, firstname

// écoute de l'url "/api/character"
app.get("/api/characters", (req, res) => {
  // connection à la base de données, et sélection de toutes les données de la table
  db.query(
    "SELECT id, lastname, firstname FROM people ORDER BY firstname ASC",
    (err, results) => {
      // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
      if (err) {
        res.status(500).send("Erreur lors de la récupération des personnages");
      } else {
        // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON.
        res.json(results);
      }
    }
  );
});

//3 GET + requête qui contient

// écoute de l'url "/api/character/simpsons"
app.get("/api/characters/simpsons/content", (req, res) => {
  // connection à la base de données, et sélection de lastname, firstname
  db.query("SELECT * FROM people WHERE lastname LIKE '%s%'", (err, results) => {
    // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
    if (err) {
      res.status(500).send("Erreur lors de la récupération des personnages");
    } else {
      // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON.
      res.json(results);
    }
  });
});

//4 GET + requête qui commence par

// écoute de l'url "/api/character/simpsons"
app.get("/api/characters/simpsons/begin", (req, res) => {
  // connection à la base de données, et sélection de lastname, firstname
  db.query("SELECT * FROM people WHERE firstname LIKE 'm%'", (err, results) => {
    // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
    if (err) {
      res.status(500).send("Erreur lors de la récupération des personnages");
    } else {
      // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON.
      res.json(results);
    }
  });
});

//5 GET + requête > date

app.get("/api/characters/simpsons/date", (req, res) => {
  // connection à la base de données, et sélection de lastname, firstname
  db.query(
    "SELECT * FROM people WHERE birthday > '1980-01-01'",
    (err, results) => {
      if (err) {
        res.status(500).send("Erreur lors de la récupération des personnages");
      } else {
        res.json(results);
      }
    }
  );
});

//6 route /api/character/tri?order=<descendant>ou<ascendant>

app.get(`/api/character/tri`, (req, res) => {
  const order = req.query.order;
  if (order === "descendant") {
    db.query("SELECT * FROM people ORDER BY firstname DESC", (err, results) => {
      if (err) {
        res.status(500).send("Erreur lors de la récupération des personnages");
      } else {
        res.json(results);
      }
    });
  }
  if (order === "ascendant") {
    db.query("SELECT * FROM people ORDER BY firstname ASC", (err, results) => {
      if (err) {
        res.status(500).send("Erreur lors de la récupération des personnages");
      } else {
        res.json(results);
      }
    });
  }
});

// Support JSON-encoded bodies
app.use(express.json());
// Support URL-encoded bodies
app.use(
  express.urlencoded({
    extended: true,
  })
);
// 7 POST
app.post("/api/characters/newpeople", (req, res) => {
  // Données stockées dans req.body
  const formData = req.body;
  //insertion des données dans la table
  db.query("INSERT INTO people SET ?", formData, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la sauvegarde d'un personnage");
    } else {
      res.sendStatus(200);
    }
  });
});

// 8 PUT + requête pour modifier avec id passé en paramètre

// écoute de l'url "/api/characters/id"
app.put("/api/characters/:id", (req, res) => {
  // récupération des données envoyées
  const idCharac = req.params.id;
  const formData = req.body;
  db.query("UPDATE people SET ? WHERE id = ?", [formData, idCharac], (err) => {
    if (err) {
      // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
      console.log(err);
      res.status(500).send("Erreur lors de la modification d'un personnage");
    } else {
      // Si tout s'est bien passé, on envoie un statut "ok".
      res.sendStatus(200);
    }
  });
});

// 8 PUT + requête pour modifier avec id passé dans les données
// écoute de l'url "/api/characters/"
// app.put("/api/characters/", (req, res) => {
//   const idCharac = req.body.id;
//   const formData = req.body;
//   connection.query(
//     "UPDATE people SET ? WHERE id = ?",
//     [formData, idCharac],
//     (err) => {
//       // TODO envoyer une réponse au client (étape 4)
//       if (err) {
//         console.log(err);
//         res.status(500).send("Erreur lors de la modification d'un personnage");
//       } else {
//         res.sendStatus(200);
//       }
//     }
//   );
// });

// 9 PUT toggle booléen

//route /api/character/hashair?name=<false>ou<true>
app.put(`/api/character/hashair`, (req, res) => {
  const hashair = req.query.hashair;
  if (hashair === "true") {
    db.query(
      "UPDATE people SET has_hair = 1 WHERE has_hair IS false",
      (err, results) => {
        if (err) {
          res
            .status(500)
            .send("Erreur lors de la modification has_hair à true");
        } else {
          res.json(results);
        }
      }
    );
  }
  if (hashair === "false") {
    db.query(
      "UPDATE people SET has_hair = 0 WHERE has_hair IS true",
      (err, results) => {
        if (err) {
          return res
            .status(500)
            .send("Erreur lors de la modification has_hair à false");
        } else {
          res.json(results);
        }
      }
    );
  }
});

// 10 DELETE Suppression d'un personnage par l'id

// écoute de l'url "/api/characters/id"
app.delete("/api/characters/:id", (req, res) => {
  const idCharac = req.params.id;
  db.query("DELETE FROM people WHERE id = ?", [idCharac], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la suppression d'un personnage");
    } else {
      res.sendStatus(200);
    }
  });
});

// 11 DELETE perso avec booléen à false

// écoute de l'url "/api/character/delnothair"
app.delete("/api/character/delnothair", (req, res) => {
  db.query("DELETE FROM people WHERE has_hair IS false", (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la suppression d'un personnage");
    } else {
      res.sendStatus(200); //OK
    }
  });
});

// écoute
app.listen(port, (err) => {
  if (err) {
    throw new Error("Something bad happened...");
  }

  console.log(`Server is listening on ${port}`);
});
