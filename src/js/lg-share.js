(function() {

    'use strict'

    var defaults = {
        share: true,
        facebook: true,
        facebookDropdownText: 'Facebook',
        twitter: true,
        twitterDropdownText: 'Twitter',
        googlePlus: true,
        googlePlusDropdownText: 'GooglePlus',
        pinterest: true,
        pinterestDropdownText: 'Pinterest',
        whatsapp: true,
        whatsappDropdownText: 'WhatsApp',
        linkedin: true,
        linkedinDropdownText: 'Linkedin'
    },
    socialNetworks = [
        {
            name: 'facebook',
            url: 'https://www.facebook.com/sharer/sharer.php?u={url}',
            mobileOnly: false
        },
        {
            name: 'twitter',
            url: 'https://twitter.com/intent/tweet?text={text}&url={url}',
            mobileOnly: false
        },
        {
            name: 'googlePlus',
            url: 'https://plus.google.com/share?url={url}',
            mobileOnly: false
        },
        {
            name: 'pinterest',
            url: 'http://www.pinterest.com/pin/create/button/?url={url}&media={media}&description={text}',
            mobileOnly: false
        },
        {
            name: 'linkedin',
            url: 'https://www.linkedin.com/shareArticle?mini=true&url={url}',
            mobileOnly: false
        },
        {
            name: 'whatsapp',
            url: 'whatsapp://send?text={url}',
            mobileOnly: true
        }

    ]


    var Share = function(element) {

        this.core = $(element).data('lightGallery')

        this.core.s = $.extend({}, defaults, this.core.s)

        if (this.core.s.share) {
            this.init()
        }

        return this
    }

    var createShareLink = function(id, text) {
        var $list = $('<li />'),
            $link = $('<a />').attr({
                'id': 'lg-share-' + id.toLowerCase(),
                'target': '_blank'
            }),
            $text = $('<span />').attr('class', 'lg-icon'),
            $icon = $('<span />').attr('class', 'lg-dropdown-text').text(text)

            $link.append([$text, $icon]).appendTo($list)

        return $list
    }

    var replaceWithObject = function(string, object) {
        return string.replace ? string.replace(/\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g, function (match, key) {
            return typeof object[key] === 'undefined' ? match : object[key]
        }) : string
    }

    var addNetworkShareUrl = function (index, networkName, url) {
        var _this = this,
            completeUrl = replaceWithObject(url, {
                'url': (encodeURIComponent(_this.getShareProps(index, networkName + 'ShareUrl') || window.location.href)),
                'text': (_this.getShareProps(index, networkName + 'Text') || ''),
                'media': encodeURIComponent(_this.getShareProps(index, 'src'))
            })

        $('#lg-share-' + networkName.toLowerCase()).attr('href', completeUrl)
    }

    var isMobile = function () {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera

        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return true
        }

        if (/android/i.test(userAgent)) {
            return true
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return true
        }

        return false
    }

    Share.prototype.init = function() {
        var _this = this,
            $share = $('<span />').attr({
                'class': 'lg-icon',
                'id': 'lg-share'
            }),
            $list = $('<ul />').attr({
                'class': 'lg-dropdown',
                'style': 'position: absolute;'
            })

        socialNetworks.forEach(function(network){
            if (_this.core.s.hasOwnProperty(network.name) && _this.core.s[network.name] && (isMobile() || !network.mobileOnly) ) {
                $list.append(createShareLink(network.name, _this.core.s[network.name + 'DropdownText']))
            }
        })

        $list.appendTo($share)

        this.core.$outer.find('.lg-toolbar').append($share);
        this.core.$outer.find('.lg').append('<div id="lg-dropdown-overlay"></div>');

        $('#lg-share').on('click.lg', function(){
            _this.core.$outer.toggleClass('lg-dropdown-active')
        })

        $('#lg-dropdown-overlay').on('click.lg', function(){
            _this.core.$outer.removeClass('lg-dropdown-active')
        })

        _this.core.$el.on('onAfterSlide.lg.tm', function(event, prevIndex, index) {

            setTimeout(function() {

                socialNetworks.forEach(function(network){
                    if (_this.core.s.hasOwnProperty(network.name) && _this.core.s[network.name]){
                    addNetworkShareUrl.call(_this, index, network.name, network.url)
                    }
                })

            }, 100)
        })
    }

    Share.prototype.getShareProps = function(index, prop) {
        var shareProp = ''

        if (this.core.s.dynamic) {
            shareProp = this.core.s.dynamicEl[index][prop]
        } else {
            var _href = this.core.$items.eq(index).attr('href'),
                _prop = this.core.$items.eq(index).data(prop)

            shareProp = prop === 'src' ? _href || _prop : _prop
        }
        return shareProp
    }

    Share.prototype.destroy = function() {

    }

    $.fn.lightGallery.modules.share = Share

})();

