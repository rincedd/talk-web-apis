// get file from <input> element
const file = document.querySelector('#my-input').files[0];

const reader = new FileReader();

reader.on('loadend', () => {
  const numWords = reader.result.split(/\s+/).length;
  console.log(`${numWords} words found in ${file.name}`);
});

reader.readAsText(file);

// download contents of my fancy <canvas> drawing as image
document.querySelector('canvas').toBlob(blob => {
  const url = URL.createObjectURL(blob);
  location.assign(url);
});
