function extend(obj, values) {
  const clone = { ...obj };
  return Object.assign(clone, values);
}

const agent = {
  id: 1,
  uuid: 'yyy-yyy-yyy',
  name: 'fixture',
  usernanme: 'platzi',
  hostname: 'test-host',
  pid: 0,
  connected: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const agents = [
  agent,
  extend(agent, {
    id: 2, uuid: 'yyy-yyy-yyw', connected: false, username: 'test',
  }),
  extend(agent, { id: 3, uuid: 'yyy-yyy-yyx' }),
  extend(agent, { id: 4, uuid: 'yyy-yyy-yyz', username: 'test' }),
];

module.exports = {
  single: agent,
  all: agents,
  connected: agents.filter((a) => a.connected),
  platzi: agents.filter((a) => a.usersname === 'platzi'),
  byUuid: (id) => agents.filter((a) => a.uuid === id).shift(),
  findbyId: (id) => agents.filter((a) => a.id === id).shift(),
};
