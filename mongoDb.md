# Call save() when you are working with a Mongoose document instance (a document fetched from the database) did some logic on that (modified it) and you want to persist changes you've made to it.

# Do not call save() if you're using a query method that performs the update or creation operation directly (e.g., findByIdAndUpdate, updateOne, updateMany, Model.create, etc.).

