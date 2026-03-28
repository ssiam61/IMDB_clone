const express = require("express");
const app = express();

app.use(express.json());

const cors = require("cors");
app.use(cors());
const queryRoutes = require("./routes/queries");
app.use("/api", queryRoutes);

app.use("/users", require("./routes/users"));
app.use("/admin", require("./routes/admin"));
app.use("/admin_log", require("./routes/admin_log"));
app.use("/user_ban", require("./routes/user_ban"));
app.use("/report", require("./routes/report"));

app.use("/genre", require("./routes/genre"));
app.use("/preference", require("./routes/preference"));
app.use("/person", require("./routes/person"));
app.use("/fan", require("./routes/fan"));
app.use("/award", require("./routes/award"));
app.use("/person_award", require("./routes/person_award"));

app.use("/media", require("./routes/media"));
app.use("/movie", require("./routes/movie"));
app.use("/series", require("./routes/series"));
app.use("/season", require("./routes/season"));
app.use("/episode", require("./routes/episode"));

app.use("/media_genre", require("./routes/media_genre"));
app.use("/media_personality", require("./routes/media_personality"));
app.use("/media_award", require("./routes/media_award"));

app.use("/review", require("./routes/review"));
app.use("/reply", require("./routes/reply"));
app.use("/watchlist", require("./routes/watchlist"));
app.use("/post_attachments", require("./routes/post_attachments"));
app.use("/reply_attachments", require("./routes/reply_attachments"));

app.listen(5000, () => {
  console.log("server running on port 5000");
});