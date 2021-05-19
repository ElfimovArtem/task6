/* USERS */

create table users (
    id serial primary key,
    login varchar (50) unique not null,
    password varchar (50) not null,
    age integer not null,
    is_deleted boolean default '0'
);

insert into users (login, password, age) values ('user1', '12345', 12);
insert into users (login, password, age) values ('user2', 'qwerty', 16);
insert into users (login, password, age) values ('SuperMegaGamer', 'ASDFG', 64);
insert into users (login, password, age) values ('Dima', 'passsssword', 9);

/* GROUPS */

CREATE TYPE permissionType AS ENUM ('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES');

create table groups (
    id serial primary key,
    name varchar (255) not null,
    permissions permissionType[]
);

insert into groups (name, permissions) values ('admin', '{READ, WRITE, DELETE, SHARE, UPLOAD_FILES}');
insert into groups (name, permissions) values ('user', '{READ, WRITE}');
insert into groups (name, permissions) values ('guest', '{READ}');

/* USERS-GROUPS */

create table users_groups (
    id serial primary key,
    user_id serial references users(id) on delete cascade,
    group_id serial references groups(id) on delete cascade
);

insert into users_groups (user_id, group_id) values (1, 1);