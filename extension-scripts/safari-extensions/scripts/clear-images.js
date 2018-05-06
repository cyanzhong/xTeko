var images = document.getElementsByTagName('img');
while(images.length > 0) {
  images[0].parentNode.removeChild(images[0]);
}