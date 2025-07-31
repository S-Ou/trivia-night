import { ComponentType } from "react";
import {
  CategorySlideProps,
  HomeSlideProps,
  ResultSlideProps,
} from "./slideProps";

export interface BaseSlideTheme {
  HomeSlide: ComponentType<HomeSlideProps>;
  TitleSlide: ComponentType<CategorySlideProps>;
  QuestionSlide: ComponentType<CategorySlideProps>;
  SummarySlide: ComponentType<CategorySlideProps>;
  ResultSlide: ComponentType<ResultSlideProps>;
}
