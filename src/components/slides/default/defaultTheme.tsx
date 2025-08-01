import { SlideThemeBase } from "../baseSlideTheme";
import { QuestionSlide } from "./questionSlide";
import { ResultSlide } from "./resultSlide";
import { SummarySlide } from "./summarySlide";
import { TitleSlide } from "./titleSlide";
import HomeSlide from "./homeSlide";

export class DefaultTheme extends SlideThemeBase {
  static title = "Default";
  static id = "default";

  HomeSlide = HomeSlide;
  TitleSlide = TitleSlide;
  QuestionSlide = QuestionSlide;
  SummarySlide = SummarySlide;
  ResultSlide = ResultSlide;
}

export class DuplicateDefaultTheme extends SlideThemeBase {
  static title = "Default dupe";
  static id = "default-dupe";

  HomeSlide = HomeSlide;
  TitleSlide = TitleSlide;
  QuestionSlide = QuestionSlide;
  SummarySlide = SummarySlide;
  ResultSlide = ResultSlide;
}
