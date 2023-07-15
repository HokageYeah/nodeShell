const sessionKey = "yeahcookie";

// 根据Cookie中的ID获取用户的Session
async function getSession(database: any, ctx: any, name: any) {
  const key = ctx.cookies[sessionKey];
  if (key) {
    const now = Date.now();
    const session = await database.get(
      "SELECT * FROM session WHERE key = ? and name = ? and expires > ?",
      key,
      name,
      now
    );
    if (session) {
      return JSON.parse(session.value);
    }
  }
  return null;
}

// 创建新的session
async function setSession(database: any, ctx: any, name: any, data: any) {
  try {
    const key = ctx.cookies[sessionKey];
    if (key) {
      let result = await database.get(
        "SELECT id FROM session WHERE key = ? AND name = ?",
        key,
        name
      );
      // 如果result不存在，那么插入这个session
      if (!result) {
        result = await database.run(
          `INSERT INTO session(key, name, value, created, expires)
          VALUES (?, ?, ?, ?, ?)`,
          key,
          name,
          JSON.stringify(data),
          Date.now(),
          Date.now() + 7 * 86400 * 1000
        );
      } else {
        // 存在的话更新这个session
        result = await database.run(
          "UPDATE session SET value = ?, created = ?, expires = ? WHERE key = ? AND name = ?",
          JSON.stringify(data),
          Date.now(),
          Date.now() + 7 * 86400 * 1000,
          key,
          name
        );
      }
      return { err: "", result };
    }
    throw new Error("invalid cookie");
  } catch (error: any) {
    return { err: error.message };
  }
}

export { getSession, setSession };
