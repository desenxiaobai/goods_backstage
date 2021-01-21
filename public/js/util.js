(function(window, undefined) {
    let util = {
        data_format(data, format = 'YYYY-MM-DD hh:mm:ss') {
            return moment(data).format(format);
        }
    }
    window.util = util;
})(window);