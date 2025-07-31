import { BaseSlideTheme } from "../slideTheme";
import HomeSlide from "./homeSlide";
import { QuestionSlide } from "./questionSlide";
import { TitleSlide } from "./titleSlide";
import { SummarySlide } from "./summarySlide";
import { ResultSlide } from "./resultSlide";

export class BaseTheme extends BaseSlideTheme {
  HomeSlide = HomeSlide;
  TitleSlide = TitleSlide;
  QuestionSlide = QuestionSlide;
  SummarySlide = SummarySlide;
  ResultSlide = ResultSlide;
}