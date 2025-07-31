import { ComponentType } from "react";
import {
  CategorySlideProps,
  HomeSlideProps,
  ResultSlideProps,
} from "./slideProps";

export abstract class BaseSlideTheme {
  static title: string;
  static id: string;

  get title(): string {
    return (this.constructor as typeof BaseSlideTheme).title;
  }

  get id(): string {
    return (this.constructor as typeof BaseSlideTheme).id;
  }

  abstract HomeSlide: ComponentType<HomeSlideProps>;
  abstract TitleSlide: ComponentType<CategorySlideProps>;
  abstract QuestionSlide: ComponentType<CategorySlideProps>;
  abstract SummarySlide: ComponentType<CategorySlideProps>;
  abstract ResultSlide: ComponentType<ResultSlideProps>;
}

export abstract class SlideThemeBase implements BaseSlideTheme {
  static title: string;
  static id: string;

  get title(): string {
    return (this.constructor as typeof BaseSlideTheme).title;
  }

  get id(): string {
    return (this.constructor as typeof BaseSlideTheme).id;
  }

  abstract HomeSlide: ComponentType<HomeSlideProps>;
  abstract TitleSlide: ComponentType<CategorySlideProps>;
  abstract QuestionSlide: ComponentType<CategorySlideProps>;
  abstract SummarySlide: ComponentType<CategorySlideProps>;
  abstract ResultSlide: ComponentType<ResultSlideProps>;
}
