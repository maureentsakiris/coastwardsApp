import I18n from '../i18n/i18n'

describe('i18n', () => {
	it('falls back to english for every key used by the app', () => {
		I18n.locale = 'en'
		expect(I18n.t('map')).not.toMatch(/missing/i)
		expect(I18n.t('how')).not.toMatch(/missing/i)
		expect(I18n.t('upload_ok')).not.toMatch(/missing/i)
	})

	it('translates to german', () => {
		I18n.locale = 'de'
		expect(I18n.t('map')).not.toEqual(I18n.t('map', { locale: 'en' }))
	})
})
