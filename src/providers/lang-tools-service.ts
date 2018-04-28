import { Injectable } from '@angular/core';

import { langFileObject, langTranslationsObject } from "../customTypes/langObject.types"

/*
  Generated class for the LangToolsService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LangToolsService {
  translations : langTranslationsObject;

  constructor() {
    console.log('### LangToolsService');
  }

  initTranslations(langFiles: Array<langFileObject>) {
    this.translations = {languages: [], i18n: {}};

    langFiles.forEach(langFile => {
      let code : string = langFile.filename.substring(0, 2);
      let lang_translations : any = JSON.parse(langFile.contents);

      this.translations.languages.push(code);

      this.buildLangStructure(code, this.translations.i18n, lang_translations);

    });

    console.log("> Lang structure...", this.translations);
    //console.log(JSON.stringify(this.translations));
  }

  buildLangStructure(lang: string, level: Object, lang_translations: Object) {
    for (let key of Object.keys(lang_translations)) {
      let subkeys : Array<string> = key.split('.');
      let deep_level = level;
      let deep_key = key;

      subkeys.forEach(k=> {
        if( !deep_level.hasOwnProperty(k) ) deep_level[k] = {};
        deep_level = deep_level[k];
      })

      let translation = lang_translations[key];

      if(translation instanceof Object) {
        this.buildLangStructure(lang, deep_level, translation);
        
      } else {
        deep_level[lang] = {value: translation, approved: false, preserve: false, foundInSrc: false, comment: ""};
      }
    };
  }

}
