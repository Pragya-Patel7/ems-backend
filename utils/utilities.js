const get_current_date = () => {
	const today = new Date();
	const date =
		today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
	const time =
		today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	const dateTime = date + " " + time;

	return dateTime;
};

const modifyPath = (path) => {
	let modifiedPath = path.replace(/\\/g, "/");
	const pathArr = modifiedPath.split("/");
	pathArr.shift();
	let newPath = pathArr.join("/");
	return newPath;
};

module.exports = {
	get_current_date,
	modifyPath,
};
