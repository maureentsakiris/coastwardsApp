import * as Localization from 'expo-localization'
import I18n from 'i18n-js'

import en from './locales/en'
import de from './locales/de'
import es from './locales/es'
import ar from './locales/ar'
import el from './locales/el'
import fr from './locales/fr'
import hi from './locales/hi'
import pt from './locales/pt'
import zh from './locales/zh'
import it from './locales/it'

I18n.fallbacks = true
I18n.default_locale = 'en'
I18n.translations = {
	en,
	de,
	es,
	ar,
	el,
	fr,
	hi,
	pt,
	zh,
	it,
}

I18n.locale = Localization.locale.split('-')[0]

export default I18n
