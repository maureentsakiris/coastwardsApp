import translations from "../translations";

const translationArray = Object.entries(
  translations as Record<string, Record<string, string>>,
);
const messages: Record<string, string> = {};

for (const [key, translation] of translationArray) {
  messages[key] = translation["de"];
}

export default messages;
