const mongoose = require("mongoose");

const url = process.env.DB_URL;

const connectDb = async () => {
  try {
    if (!url) {
      throw new Error("La variable d'environnement DB_URL n'est pas définie.");
    }
    
    await mongoose.connect(url, { 
      serverSelectionTimeoutMS: 5000 
    });
    
    console.log("Base de données connectée avec succès");

  } catch (error) {
    console.error("Erreur de connexion à la base de données :", error.message);
    process.exit(1);
  }
};

// Gestion des événements de connexion
mongoose.connection.on('disconnected', () => {
  console.log("Base de données déconnectée");
});

mongoose.connection.on('error', (err) => {
  console.error("Erreur Mongoose :", err);
});

// Exécution de la connexion
connectDb();

module.exports = mongoose.connection;
