for (let c of $clipboard.text) {
  await $wait(0.1);
  $keyboard.insert(c);
}