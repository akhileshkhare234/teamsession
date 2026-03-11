const ResponseHandler = <T>() => {
  const reviewBaseImage = (response: any): T => {
    // Logic for handling review base image response
    // const result = response.flatMap(
    //   ({
    //     id,
    //     state,
    //     city,
    //     neighbourhood,
    //     imageUrl,
    //     imageUrl2,
    //     imageUrl3,
    //     imageUrl4,
    //   }: any) => [
    //     {
    //       id,
    //       state,
    //       city,
    //       neighbourhood,
    //       imageUrl: imageUrl,
    //       downloadUrl: imageUrl,
    //     },
    //     {
    //       id,
    //       state,
    //       city,
    //       neighbourhood,
    //       imageUrl: imageUrl2,
    //       downloadUrl: imageUrl2,
    //     },
    //     {
    //       id,
    //       state,
    //       city,
    //       neighbourhood,
    //       imageUrl: imageUrl3,
    //       downloadUrl: imageUrl3,
    //     },
    //     {
    //       id,
    //       state,
    //       city,
    //       neighbourhood,
    //       imageUrl: imageUrl4,
    //       downloadUrl: imageUrl4,
    //     },
    //   ]
    // );

    const imageGroup = response.contents.flatMap(function (resItem: any) {
      const resItemRes = resItem.images.map(function (imageItemRes: any) {
        return {
          ...resItem,
          imageUrl: imageItemRes.url,
          downloadUrl: imageItemRes.url,
        };
      });
      return resItemRes;
    });

    //    console.log(`imageGroup = ${imageGroup[0].imageUrl}`);

    const result = {
      images: imageGroup,
      totalPages: response.totalPages,
      totalElements: response.totalElements,
      currentPage: response.currentPage,
    };

    return result as T;
  };

  const baseVariant = (response: any): T => {
    const imageItems = response.contents.flatMap(function (content: any) {
      return {
        ...content,
        imageUrl: content.imageUrl,
        title: content.neighbourhood
          ? content.neighbourhood + " " + content.zipcode
          : content.state + " " + content.zipcode,
      };
    });

    const result = {
      id: "",
      city: "",
      state: "",
      neighbourhood: "",
      images: imageItems,
      totalPages: response.totalPages,
      totalElements: response.totalElements,
      currentPage: response.currentPage,
      queuedItemsCount: response.queuedItemsCount ?? 0,
      inProgressItemCount: response.inProgressItemCount ?? 0,
      stoppedItemsCount: response.stoppedItemsCount ?? 0,
    };

    return result as T;
  };

  const baseVariantApprovedImage = (response: any): T => {
    const imageItems = response.page.contents.flatMap(function (content: any) {
      return {
        ...content,
        imageUrl: content.imageUrl,
        title: content.neighbourhood
          ? content.neighbourhood + " " + content.zipcode
          : content.state + " " + content.zipcode,
      };
    });
    const result = {
      id: "",
      city: "",
      state: "",
      neighbourhood: "",
      images: imageItems,
      totalPages: response.page.totalPages,
      totalElements: response.page.totalElements,
      currentPage: response.page.currentPage,
      queuedItemCount: response.queuedItemCount ?? 0,
      inProgressItemCount: response.inProgressItemCount ?? 0,
      stoppedItemCount: response.stoppedItemCount ?? 0,
    };

    return result as T;
  };

  const reviewVariantImage = (response: any): T => {
    const imageItems = response.contents.flatMap(function (content: any) {
      return {
        ...content,
        imageUrl: content.image,
        title: content.neighbourhood
          ? `${content.neighbourhood} ${content.zipcode}  - ${content.variant}`
          : `${content.state} ${content.zipcode} - ${content.variant}`,
        desc: content.rejectedReason,
      };
    });

    const result = {
      id: "",
      city: "",
      state: "",
      neighbourhood: "",
      images: imageItems,
      totalPages: response.totalPages,
      totalElements: response.totalElements,
      currentPage: response.currentPage,
    };

    return result as T;
  };

  return {
    reviewBaseImage,
    baseVariant,
    reviewVariantImage,
    baseVariantApprovedImage,
  };
};

export default ResponseHandler;
