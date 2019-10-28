module.exports = { 
  // configurando as credenciais
  dialect: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'docker',
  database: 'gympoint',


  define: {
     // coluna 'createAt' and 'updateAt' dentro de cada tabela no BD
      timestamps: true,  

      // padrão de escrita do sequelize
      underscored: true,
      underscoredAll: true,
   },
};

