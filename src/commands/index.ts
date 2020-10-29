import Avatar from './avatar';
import Help from './help';

type Commands = (typeof Avatar | typeof Help);

const commands: Commands[]= [
    Avatar,
    Help,

];

export default commands;