const index_get =  (req, res) => {
    console.log("New request");
    res.render('index');
};

module.exports =  { index_get };