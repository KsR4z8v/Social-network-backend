const filterFriend = (id_user, list) => {
    const mappedList = list.map(rela => {
        let friend;
        if (rela.user1[0] === id_user) {
            friend = rela.user2
        } else {
            friend = rela.user1
        }
        friend[2] = friend[2].split('*key:*').shift()
        rela.user1 = undefined;
        rela.user2 = undefined;
        rela.user = friend
        return rela
    });
    return mappedList
};

export default filterFriend