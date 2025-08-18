import React, { useState } from "react";
import {
  Button,
  Dialog,
  Flex,
  Text,
  TextField,
  IconButton,
} from "@radix-ui/themes";
import { ImageOff, ImagePlus, Plus, Trash2 } from "lucide-react";
import styled from "styled-components";
import { Question } from "@/types/Question";
import { useQuestionContext } from "@/contexts/QuestionContext";
import { toast } from "sonner";
import { getImageUrls, setImageUrls, hasImages } from "@/utils/imageUtils";

const QuestionImage = styled.img`
  border-radius: 1rem;
  max-height: 50vh;
  max-width: 80%;
`;

const QuestionImageButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;
  position: relative;

  &:hover {
    opacity: 0.9;
  }
`;

const ImagePreviewContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  min-height: 100px;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  width: 100%;
`;

const ImagePreviewWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const ImageUrlRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
`;

const ImageErrorText = styled(Text)<{ $isVisible?: boolean }>`
  align-items: center;
  display: ${({ $isVisible }) => ($isVisible ? "flex" : "none")};
  gap: 0.5rem;
  justify-content: center;
  font-size: 0.8rem;
`;

const PreviewImage = styled(QuestionImage)<{ $isVisible?: boolean }>`
  display: ${({ $isVisible }) => ($isVisible ? "block" : "none")};
  max-height: 150px;
  max-width: 150px;
`;

const ImageCountBadge = styled.div`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background-color: var(--accent-9);
  color: white;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
`;

const AddImageButton = styled(Button)``;

const ImageUrlInput = styled(TextField.Root)`
  flex: 1;
`;

const ImageUrlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

interface ImageTriggerProps {
  question: Question;
}

export function ImageTrigger({ question }: ImageTriggerProps) {
  const [imageUrls, setImageUrlsState] = useState<string[]>(() =>
    getImageUrls(question)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [imageErrors, setImageErrors] = useState<{ [index: number]: boolean }>(
    {}
  );
  const { updateQuestion } = useQuestionContext();

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const validUrls = imageUrls.filter((url) => url.trim());
      await updateQuestion(question.id, {
        imageUrls: setImageUrls(validUrls),
        imageUrl: validUrls[0] || null, // Keep backward compatibility
      });
      toast.success("Image URLs updated successfully!");
    } catch (error) {
      console.error("Error updating image URLs:", error);
      toast.error("Failed to update image URLs");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const handleImageLoad = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: false }));
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrlsState(newUrls);
    // Reset error state when URL changes
    if (imageErrors[index]) {
      setImageErrors((prev) => ({ ...prev, [index]: false }));
    }
  };

  const addImageUrl = () => {
    setImageUrlsState([...imageUrls, ""]);
  };

  const removeImageUrl = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrlsState(newUrls);
    // Clean up error state
    const newErrors = { ...imageErrors };
    delete newErrors[index];
    // Adjust remaining error indices
    Object.keys(newErrors).forEach((key) => {
      const keyIndex = parseInt(key);
      if (keyIndex > index) {
        newErrors[keyIndex - 1] = newErrors[keyIndex];
        delete newErrors[keyIndex];
      }
    });
    setImageErrors(newErrors);
  };

  const currentImageUrls = getImageUrls(question);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        {hasImages(question) ? (
          <QuestionImageButton>
            <QuestionImage src={currentImageUrls[0]} alt="Question Image" />
            {currentImageUrls.length > 1 && (
              <ImageCountBadge>+{currentImageUrls.length - 1}</ImageCountBadge>
            )}
          </QuestionImageButton>
        ) : (
          <Button variant="soft">
            <ImagePlus size={16} />
            Add Images
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Content maxWidth="600px">
        <Dialog.Title>Edit images</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Add multiple images for this question. You can add image URLs and
          preview them below.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <div>
            <Text as="div" size="2" mb="2" weight="bold">
              Image URLs
            </Text>
            <ImageUrlsContainer>
              {imageUrls.map((url, index) => (
                <ImageUrlRow key={index}>
                  <ImageUrlInput
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    placeholder={`Enter image URL ${index + 1}`}
                  />
                  {imageUrls.length > 1 && (
                    <IconButton
                      variant="soft"
                      color="red"
                      onClick={() => removeImageUrl(index)}
                      size="2"
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  )}
                </ImageUrlRow>
              ))}
              <AddImageButton variant="soft" onClick={addImageUrl}>
                <Plus size={16} />
                Add another image
              </AddImageButton>
            </ImageUrlsContainer>
          </div>

          {imageUrls.some((url) => url.trim()) && (
            <div>
              <Text as="div" size="2" mb="2" weight="bold">
                Preview
              </Text>
              <ImagePreviewContainer>
                <ImageGrid>
                  {imageUrls.map(
                    (url, index) =>
                      url.trim() && (
                        <ImagePreviewWrapper key={index}>
                          <PreviewImage
                            src={url}
                            alt={`Image preview ${index + 1}`}
                            onError={() => handleImageError(index)}
                            onLoad={() => handleImageLoad(index)}
                            $isVisible={!imageErrors[index]}
                          />
                          <ImageErrorText
                            size="1"
                            color="red"
                            $isVisible={imageErrors[index]}
                          >
                            <ImageOff size={14} />
                            Failed to load
                          </ImageErrorText>
                        </ImagePreviewWrapper>
                      )
                  )}
                </ImageGrid>
              </ImagePreviewContainer>
            </div>
          )}
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
