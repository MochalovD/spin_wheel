$(function() {
    const WItems = !!localStorage.getItem('wheelItems') ? $.parseJSON(localStorage.getItem('wheelItems')) : [];
    let whContainerHeight = $('#wheel-container').height();
    let Circumference = whContainerHeight * 3.14;
    let itemCount = Object.keys(WItems).length;
    let arc = Circumference / itemCount;
    let arcPerc = (arc / Circumference) * 100;
    let deg = Math.floor(360 * (arcPerc / 100));
    let takenColor = []

    for (let i = 0; i < itemCount; i++) {
        let randColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        let item = $('<span class="item">')
        item.css('background-color', randColor);
        item.css('transform', "rotate(" + ((i * deg) + 45) + "deg)");
        item.html("<b><span>Text " + (i + 1) + "</span></b>")
        $('#wheel').append(item)
    }

    let i = 0;
    if (Object.keys(WItems).length > 0) {
        Object.keys(WItems).map(function(k) {
            let data = WItems[k]
            let item = $('<span class="item">')
            item.css('background-color', data.color);
            item.css('transform', "rotate(" + ((i * deg) + 45) + "deg)");
            item.html("<b><span>" + (data.text) + "</span></b>")
            $('#wheel').append(item)
            i++;
        })
    }

    if (itemCount > 1) {
        let calcArc = Math.ceil(Math.ceil(arcPerc) * 4);
        let poly = [];
        poly.push("50% 50%")
        poly.push("0% 0%")
        let i = 0;
        while (true) {
            i++;
            if (calcArc <= 100) {
                if (i == 2)
                    poly.push("100% " + (calcArc) + "%");
                else
                    poly.push("0% " + (calcArc) + "%");
                break;
            } else {
                if (i == 1)
                    poly.push("100% 0%");
                else
                    poly.push("0% 100%");
                calcArc -= 100
            }
        }

        $('#wheel .item').css('clip-path', "polygon(" + (poly.join(',')) + ")");
    }

    if (Object.keys(WItems).length > 0) {
        Object.keys(WItems).map(function(k) {
            let data = WItems[k]
            let item = $('#item-form .item-label').first().clone()
            item.find('input').val(data.text)
            $('#item-form .item-label').last().after(item)
            item.find('.rem-item').click(function() {
                rem_item(item)
            })
            item.find('input').focus()
        })
        $('#item-form .item-label').first().remove()
    }

    $('#new_item').click(function() {
        let item = $('#item-form .item-label').first().clone()
        item.find('input').val('')
        $('#item-form .item-label').last().after(item)
        item.find('.rem-item').click(function() {
            rem_item(item)
        })
        item.find('input').focus()
    })
    $('#item-form .item-label .rem-item').click(function() {
        rem_item($(this).closest('.item-label'))
    })
    $('#item-form').submit(function(e) {
        e.preventDefault()
        let items = [];
        $(this).find('[name="item_text"]').each(function() {
            let randColor;
            if ($(this).val().trim() != '') {
                while (true) {
                    randColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
                    if ($.inArray(randColor, takenColor) < 0) {
                        takenColor.push(randColor)
                        break;
                    }
                }
                items.push({ 'color': randColor, text: $(this).val() })
            }
        })

        localStorage.setItem("wheelItems", JSON.stringify(items))
        if (items.length > 0) {
            alert("Wheel Items successfully saved.")
        }
        location.reload()
    })
    $('#spin').click(function() {
        let min = 1000;
        let max = 3000;
        let degree = Math.floor(Math.random() * (max * min)) - min
        $('#wheel').css('transform', "rotate(" + degree + "deg)");
    })
})

function rem_item(_this) {
    if ($('#item-form .item-label').length == 1) {
        $('#item-form .item-label').first().find('input').val('').focus()
    } else {
        _this.remove()
    }
}

function getElsAt(top, left) {
    return $("#wheel-container")
    .find("*")
    .filter(function() {
        return $(this).offset().top == top &&
        $(this).offset().left == left && $(this).is(':visible');
    });
}