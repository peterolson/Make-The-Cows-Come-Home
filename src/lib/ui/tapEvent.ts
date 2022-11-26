// .click() responds slowly on mobile devices, so we use .touchstart and .mousedown instead.
// should only respond to one of touchstart/mousedown, but not both.

export const tap = (node: HTMLElement, callback: (e: { target: HTMLElement }) => void) => {
	node.addEventListener('mousedown', (e) => {
		e.stopImmediatePropagation();
		e.preventDefault();
		const event = { target: e.currentTarget as HTMLElement };
		callback(event);
	});

	node.addEventListener('touchstart', (e) => {
		e.stopImmediatePropagation();
		e.preventDefault();
		const event = { target: e.currentTarget as HTMLElement };
		callback(event);
	});
};
