package com.github.heatskr.wdps;

import java.util.List;

// import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "document", path = "document")
public interface DocumentRepository extends PagingAndSortingRepository<Document, Integer>
{
  List<Document> findByCode(String code);

  List<Document> findByRequester(String requester);
};
