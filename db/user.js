import bcrypt from "bcryptjs";

export const findUserWithPassword = async (db, username, password) => {
  const user = await db.collection("users").findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    return { ...user, password: undefined }; // filtered out password
  }
  return null;
};

export const findUser = async (db, username) => {
  const user = await db
    .collection("users")
    .findOne({ username }, { projection: { password: 0 } });

  return user || null;
};

export const addUser = async (db, username, originalPassword) => {
  const password = await bcrypt.hash(originalPassword, 10);
  await db.collection("users").insertOne({ username, password });
};
