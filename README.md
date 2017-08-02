# providence-hackathon

## UI

```sh
npm install
npm run start
```

login:  patient@com
pass:   patient

## Добавить ресурсы Bundle в Aidbox:

POST /fhir/ 
и содержимое файла bundle-with-patients-and-relatedpersons.json в качестве тела запроса.

Потом то же самое для файла bundle-with-practitioners-encounters-conditions-appointments-medicationorders.json.

После этого можно выполнять запросы.

GET /fhir/RelatedPerson?patient=pt-mother-lindsey-ferrell&_revinclude=Patient:link
Запрос вернёт членов семьи - родственников матери в данном случае - и выведет 3 ресурса RelatedPerson и 3 ресурса Patient.

