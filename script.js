const TYPE = {
  MEAL: 'meal',
  MED: 'medicine',
};

const ITEMS_ORIGINAL = [
  { type: TYPE.MEAL, text: 'breakfast', done: false },
  { type: TYPE.MEAL, text: 'lunch', done: false },
  { type: TYPE.MEAL, text: 'dinner', done: false },
];

const itemsLocalstorageKey = 'med_tracker_items';
const timestampLocalstorageKey = 'med_tracker_time';

let itemsToRender = structuredClone(ITEMS_ORIGINAL);

function markTimestamp() {
  localStorage.setItem(timestampLocalstorageKey, new Date().toISOString());
}

function storeData() {
  localStorage.setItem(itemsLocalstorageKey, JSON.stringify(itemsToRender));
}

function render() {
  const listEl = document.querySelector('main ol');

  listEl.innerHTML = '';

  itemsToRender.forEach((item, i) => {
    const itemEl = document.createElement('li');
    itemEl.classList.add(item.type);
    if (item.done) {
      itemEl.classList.add('done');
    }
    itemEl.textContent = item.text.trim();

    const upButtonEl = document.createElement('button');
    const upButtonIconImg = document.createElement('img');
    upButtonIconImg.src = './icon-up.svg';
    upButtonEl.append(upButtonIconImg);
    const downButtonEl = document.createElement('button');
    const downButtonIconImg = document.createElement('img');
    downButtonIconImg.src = './icon-up.svg';
    downButtonIconImg.classList.add('down');
    downButtonEl.append(downButtonIconImg);
    const deleteButtonEl = document.createElement('button');
    const deleteButtonIconImg = document.createElement('img');
    deleteButtonIconImg.src = './icon-minus.svg';
    deleteButtonIconImg.classList.add('delete');
    deleteButtonEl.append(deleteButtonIconImg);
    const doneButtonEl = document.createElement('button');
    const doneButtonIconImg = document.createElement('img');
    doneButtonIconImg.src = './icon-checkmark.svg';
    doneButtonEl.append(doneButtonIconImg);

    upButtonEl.onclick = () => {
      const temp = itemsToRender[i];
      itemsToRender[i] = itemsToRender[i - 1];
      itemsToRender[i - 1] = temp;

      storeData();
      markTimestamp();
      render();
    };

    downButtonEl.onclick = () => {
      const temp = itemsToRender[i];
      itemsToRender[i] = itemsToRender[i + 1];
      itemsToRender[i + 1] = temp;

      storeData();
      markTimestamp();
      render();
    };
    
    doneButtonEl.onclick = () => {
      itemEl.classList.toggle('done');
      itemsToRender[i].done = itemEl.classList.contains('done')
      
      storeData();
      markTimestamp();
    };

    deleteButtonEl.onclick = () => {
      if (!confirm('Confirm delete?')) return;

      itemsToRender.splice(i, 1)
    
      storeData();
      markTimestamp();
      render();
    }

    if (item.done) {
      itemEl.classList.add('done');
    }

    const btnGroupEl = document.createElement('div');
    btnGroupEl.classList.add('btn-group');

    if (i === itemsToRender.length - 1) {
      downButtonEl.setAttribute('disabled', 'true');
    }

    if (i === 0) {
      upButtonEl.setAttribute('disabled', 'true');
    }
    
    if (item.type === TYPE.MED) {
      btnGroupEl.append(deleteButtonEl)
    }

    btnGroupEl.append(downButtonEl);
    btnGroupEl.append(upButtonEl);
    btnGroupEl.append(doneButtonEl);

    itemEl.append(btnGroupEl);
    listEl.append(itemEl);
  });
}

const formEl = document.getElementById('input');
formEl.onsubmit = (e) => {
  e.preventDefault();

  const inputEl = formEl.querySelector('textarea');

  const meds = inputEl.value.split(',');

  itemsToRender = structuredClone(ITEMS_ORIGINAL);

  meds.forEach((med) => {
    itemsToRender.push({ type: TYPE.MED, text: med, done: false });
  });

  render();
};

const lastUpdatedDate = localStorage.getItem(timestampLocalstorageKey);

const storedItems = localStorage.getItem(itemsLocalstorageKey);

if (new Date(lastUpdatedDate).getDate() !== new Date().getDate()) {
  itemsToRender = JSON.parse(storedItems).map(a => ({ ...a, done: false }))
} else {
  itemsToRender = JSON.parse(storedItems);
}

render();
