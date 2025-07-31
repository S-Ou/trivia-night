import { ComponentType } from "react";
import { CategorySlideProps, ResultSlideProps, SlideProps } from "./slideProps";

export interface ISlideTheme {
  HomeSlide: ComponentType<SlideProps>;
  TitleSlide: ComponentType<CategorySlideProps>;
  QuestionSlide: ComponentType<CategorySlideProps>;
  SummarySlide: ComponentType<CategorySlideProps>;
  ResultSlide: ComponentType<ResultSlideProps>;
}

export abstract class BaseSlideTheme implements ISlideTheme {
  abstract HomeSlide: ComponentType<SlideProps>;
  abstract TitleSlide: ComponentType<CategorySlideProps>;
  abstract QuestionSlide: ComponentType<CategorySlideProps>;
  abstract SummarySlide: ComponentType<CategorySlideProps>;
  abstract ResultSlide: ComponentType<ResultSlideProps>;
}
