
class BooksController {
    static getBooksList(req, res){
        Authentication.find({ username: req.query.username }, (err, bookList) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                res.status(200).send({
                    bookList: bookList,
                });
            }
        });
    }
}

module.exports = BooksController;