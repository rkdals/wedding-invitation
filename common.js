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
    alert('삭제되었습니다.');
    location.reload();
  } else if (passwd !== null) {
    alert('비밀번호가 일치하지 않습니다.');
  }
}

const submitForm = async () => {
  const getValueById = id => document.getElementById(id).value;
  const name = getValueById('name');
  if (name === '') {
    alert('이름을 입력해주세요.');
    return;
  }
  const passwd = getValueById('passwd');
  if (passwd === '') {
    alert('비밀번호를 입력해주세요.');
    return;
  }
  const message = getValueById('message');
  if (passwd === '') {
    alert('메세지를 입력해주세요.');
    return;
  }
  await insertData({name, passwd, message});
  location.reload();
}

const getDataRecent = async () =>
  await supabase.from(TABLE_ID).select()
    .order('created_at', {ascending: false}).limit(MAX_RECENT_COMMENTS);

const getDataAll = async () => await supabase.from(TABLE_ID)
  .select().order('created_at', {ascending: false});

const getCount = async () => await supabase.from(TABLE_ID).select('*', {count: 'exact', head: true});

const escapeHtml = str =>
  String(str).replace(/[&<>"'`=\/]/g, s => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  }[s]));

const renderGuestbook = async fetchData => {
  const guestbook = document.getElementById('guestbook');
  let idx = 0;
  for (let {id, created_at, name, message} of (await fetchData()).data) {
    const date = new Date(created_at).toLocaleString('ko-KR');
    guestbook.insertAdjacentHTML('beforeend', 
      `<div class="entry">
         <div class="row">
           <span class="name">${escapeHtml(name)}</span>
           <span class="date">${date}</span>
         </div>
         <div class="message">${escapeHtml(message)}</div>
         <span class="delete" id="delete-${idx}">삭제</span>
       <div>`
    );
    document.getElementById(`delete-${idx}`).addEventListener('click', async () => {
      const input = window.prompt('비밀번호를 입력하세요.');
      await deleteData(id, input);
    });
    idx++;
  }
}
