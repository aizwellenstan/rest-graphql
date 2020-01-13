# Refined-graphql

#Get Author
{
authors{
name
age
books{
name
genre
}
}
}

#Get Book
{
books{
name
genre
}
}

#Add Author
mutation {
addAuthor(name: "test1", age: 38){
name
age
}
}

#Add Book
mutation {
addBook(name: "test1_book", genre: "test1", authorId:"5e156d037eef1b6c79d0543b"){
name
genre
}
}
