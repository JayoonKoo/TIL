async function loadJson(url) {
  const response = await fetch(url);
	if (response.status === 200) {
		return await response.json();
	} 
	throw new Error(response.status);
}

loadJson('no-such-user.json')
  .catch(console.log); // Error: 404


