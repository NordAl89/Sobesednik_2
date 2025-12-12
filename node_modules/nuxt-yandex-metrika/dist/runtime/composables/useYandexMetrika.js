import { useNuxtApp } from "#app";
export function useYandexMetrika() {
  const { $yandexMetrika } = useNuxtApp();
  return $yandexMetrika;
}
