// works
fetch("https://sponsorflare.com/", {
  headers: { Authorization: `Basic ${btoa("jan:password")}` },
})
  .then((res) => res.text())
  .then(console.log);

// breaks

fetch("https://jan:password@sponsorflare.com/")
  .then((res) => res.text())
  .then(console.log);
