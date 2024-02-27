import { v4 as uuid } from 'uuid';

const names = [
	'Puppy',
	'Kitty',
	'Mouse',
	'Hamster',
	'Bunny',
	'Fox',
	'Bear',
	'Panda',
	'Polar Bear',
	'Koala',
	'Tiger',
	'Lion',
	'Cow',
	'Piggy',
	'Monkey',
	'Chick',
];

export function getRandomUser() {
	const name = names[(Math.random() * names.length) | 0];
	return {
		id: uuid(),
		name,
	} as const;
}
