async function getList(database: any) {
  let result = [];
  try {
    result = await database.all("SELECT * FROM todo");
  } catch (error) {
    console.log('database------error');
  }
  return result;
}

async function addTask(database: any, userInfo: any, { text, state }: any) {
  try {
    const data = await database.run('INSERT INTO todo(text,state,userid) VALUES (?, ?, ?)', text, state, userInfo.id)
    return { err: '', data };
  } catch (error: any) {
    return { err: error.message };
  }
}

export {
  getList,
  addTask
}