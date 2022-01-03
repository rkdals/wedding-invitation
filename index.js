const SUPABASE_URL = 'https://bbruhsackdgiwtoxnkhz.supabase.co'
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTE5NzU3MCwiZXhwIjoxOTU2NzczNTcwfQ.3yqcxMFv0pBfyFUiLbH2CDGK5KDKI5nAnpCUPUyU8aE'
const TABLE_ID = 'comments';
const MAX_RECENT_COMMENTS = 3;

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

const insertData = async data => await supabase.from(TABLE_ID).insert([data]);

const deleteData = async (id, passwd) => {
  const {data} = await supabase.from(TABLE_ID).select('id, passwd').match({id});
  if (passwd === data[0].passwd) {
    await supabase.from(TABLE_ID).delete().match({id});
    alert('deleted');
    location.reload();
  } else {
    alert('wrong pw');
  }
}

const submitForm = async () => {
  const getValueById = id => document.getElementById(id).value;
  await insertData({
    name: getValueById('name'),
    passwd: getValueById('passwd'),
    message: getValueById('message'),
  });
  alert('submitted');
  location.reload();
}

const getDataRecent = async () =>
  await supabase.from(TABLE_ID).select()
    .order('created_at', {ascending: false}).limit(MAX_RECENT_COMMENTS);

const getDataAll = async () => await supabase.from(TABLE_ID).select();

const renderGuestbook = async fetchData => {
  const createDivWithText = text => {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div;
  }
  const guestbook = document.getElementById('guestbook');
  for (let {id, created_at, name, message} of (await fetchData()).data) {
    const date = new Date(created_at).toLocaleString('ko-KR');
    const func = `(async () => {
      const input = window.prompt('enter pw');
      await deleteData('${id}', input);
    })();`
    guestbook.insertAdjacentHTML('beforeend', 
      `<div class="entry">
	 <div class="name">${name}</div>
         <div class="row">
	   <div class="date">${date}</div>
	   <img class="delete-icon" src="delete_black_24dp.svg" onclick="${func}">
	 </div>
         <div class="message">${message}</div>
       <div>`
    );
  }
}

