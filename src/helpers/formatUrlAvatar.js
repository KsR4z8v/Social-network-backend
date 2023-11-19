const formatUrlAvatar = (list) => {
    list.map(c => {
        const aux = c
        aux.url_avatar = c.url_avatar.split('*key:*')[0]
        return c
    }
    )
}

export default formatUrlAvatar