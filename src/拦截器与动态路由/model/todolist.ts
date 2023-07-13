export async function getList(database: any) {
  let result = [];
  try {
    result = await database.all("SELECT * FROM todo");
  } catch (error) {
    console.log('database------error');
  }
  return result;
}
