const SUPABASE_URL = 'https://bbruhsackdgiwtoxnkhz.supabase.co'
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTE5NzU3MCwiZXhwIjoxOTU2NzczNTcwfQ.3yqcxMFv0pBfyFUiLbH2CDGK5KDKI5nAnpCUPUyU8aE'
const TABLE_ID = 'comments';
const MAX_RECENT_COMMENTS = 3;

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

const insertData = async data => await supabase.from(TABLE_ID).insert([data]);

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
  for (let {id, created_at, name, text} of (await fetchData()).data) {
    // TODO: Attach onclick listener to delete after matching password.
    const div = createDivWithText(text);
    div.appendChild(createDivWithText(name));
    div.appendChild(createDivWithText(created_at));
    guestbook.appendChild(div);
  }
}
