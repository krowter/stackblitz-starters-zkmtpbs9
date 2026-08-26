const TYPE = {
  MEAL: 'meal',
  MED: 'medicine',
};

const ITEMS_ORIGINAL = [
  { type: TYPE.MEAL, text: 'breakfast' },
  { type: TYPE.MEAL, text: 'lunch' },
  { type: TYPE.MEAL, text: 'dinner' }
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
      markTimestamp();
      itemEl.classList.toggle('done');
    };

    const btnGroupEl = document.createElement('div');
    btnGroupEl.classList.add('btn-group');

    if (i === itemsToRender.length - 1) {
      downButtonEl.setAttribute('disabled', 'true');
    }

    if (i === 0) {
      upButtonEl.setAttribute('disabled', 'true');
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
    itemsToRender.push({ type: TYPE.MED, text: med });
  });

  render();
};

const lastUpdatedDate = localStorage.getItem(timestampLocalstorageKey);

if (new Date(lastUpdatedDate).getDate() !== new Date().getDate()) {
  const storedItems = localStorage.getItem(itemsLocalstorageKey);
  itemsToRender = JSON.parse(storedItems);

  render();
}
