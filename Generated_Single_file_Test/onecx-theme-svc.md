# Files from C:\Users\prath\onecx\onecx-other\onecx-theme-svc\src

## Folder: onecx-theme-svc/src/main/docker (2 files)

### File: onecx-theme-svc/src/main/docker/Dockerfile.jvm

```dockerfile

FROM ghcr.io/onecx/docker-quarkus-jvm:0.26.0

COPY --chown=185 target/quarkus-app/lib/ /deployments/lib/
COPY --chown=185 target/quarkus-app/*.jar /deployments/
COPY --chown=185 target/quarkus-app/app/ /deployments/app/
COPY --chown=185 target/quarkus-app/quarkus/ /deployments/quarkus/
USER 185


```

### File: onecx-theme-svc/src/main/docker/Dockerfile.native

```dockerfile

FROM ghcr.io/onecx/docker-quarkus-native:0.28.0

COPY --chown=1001:root target/*-runner /work/application


```

## Folder: onecx-theme-svc/src/main/helm (2 files)

### File: onecx-theme-svc/src/main/helm/Chart.yaml

```yaml

apiVersion: v2
name: onecx-theme-svc
version: 0.0.0
appVersion: 0.0.0
description: Onecx theme service
keywords:
  - tenant
sources:
  - https://github.com/onecx/onecx-theme-svc
maintainers:
  - name: Tkit Developer
    email: tkit_dev@1000kit.org
dependencies:
  - name: helm-quarkus-app
    alias: app
    version: 0.42.0
    repository: oci://ghcr.io/onecx/charts

```

### File: onecx-theme-svc/src/main/helm/values.yaml

```yaml

app:
  name: svc
  image:
    repository: "onecx/onecx-theme-svc"
  db:
    enabled: true
  operator:
    keycloak:
      client:
        enabled: true
        spec:
          kcConfig:
            defaultClientScopes: [ ocx-tn:read ]
    microservice:
      spec:
        description: OneCX Theme Backend Service
        name: OneCX Theme SVC

```

## Folder: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/criteria (1 files)

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/criteria/ThemeSearchCriteria.java

```java

package org.tkit.onecx.theme.domain.criteria;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@RegisterForReflection
public class ThemeSearchCriteria {

    private String name;

    private Integer pageNumber;

    private Integer pageSize;

}


```

## Folder: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/daos (4 files)

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/daos/IconDAO.java

```java

package org.tkit.onecx.theme.domain.daos;

import java.util.Set;
import java.util.stream.Stream;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;

import org.tkit.onecx.theme.domain.models.Icon;
import org.tkit.onecx.theme.domain.models.Icon_;
import org.tkit.onecx.theme.domain.models.Image_;
import org.tkit.quarkus.jpa.daos.AbstractDAO;
import org.tkit.quarkus.jpa.exceptions.DAOException;

@ApplicationScoped
public class IconDAO extends AbstractDAO<Icon> {

    @Transactional(Transactional.TxType.SUPPORTS)
    public Stream<Icon> findIconsByNamesAndRefId(Set<String> iconNames, String refId) {
        try {
            var cb = this.getEntityManager().getCriteriaBuilder();
            var cq = cb.createQuery(Icon.class);
            var root = cq.from(Icon.class);
            cq.where(cb.and(cb.equal(root.get(Icon_.REF_ID), refId), root.get(Icon_.name).in(iconNames)));
            return this.getEntityManager().createQuery(cq).getResultStream();

        } catch (Exception ex) {
            throw new DAOException(IconDAO.ErrorKeys.ERROR_FIND_ICONS_BY_NAMES_AND_REF_ID, ex);
        }
    }

    public Icon findByNameAndRefId(String parentName, String refId) {
        try {
            var cb = this.getEntityManager().getCriteriaBuilder();
            var cq = cb.createQuery(Icon.class);
            var root = cq.from(Icon.class);
            cq.where(cb.and(cb.equal(root.get(Icon_.REF_ID), refId), cb.equal(root.get(Icon_.NAME), parentName)));
            return this.getEntityManager().createQuery(cq).getSingleResult();
        } catch (NoResultException ex) {
            return null;
        } catch (Exception e) {
            throw new DAOException(IconDAO.ErrorKeys.FIND_ENTITY_BY_PARENT_NAME_FAILED, e);
        }
    }

    @Transactional(value = Transactional.TxType.REQUIRED, rollbackOn = DAOException.class)
    public void deleteQueryByRefId(String refId) throws DAOException {
        try {
            var cq = deleteQuery();
            var root = cq.from(Icon.class);
            var cb = this.getEntityManager().getCriteriaBuilder();

            cq.where(cb.equal(root.get(Image_.REF_ID), refId));
            getEntityManager().createQuery(cq).executeUpdate();
            getEntityManager().flush();
        } catch (Exception e) {
            throw handleConstraint(e, IconDAO.ErrorKeys.FAILED_TO_DELETE_BY_REF_ID_QUERY);
        }
    }

    public enum ErrorKeys {
        ERROR_FIND_ICONS_BY_NAMES_AND_REF_ID,
        FIND_ENTITY_BY_PARENT_NAME_FAILED,
        FAILED_TO_DELETE_BY_REF_ID_QUERY
    }
}


```

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/daos/ImageDAO.java

```java

package org.tkit.onecx.theme.domain.daos;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;

import org.tkit.onecx.theme.domain.models.*;
import org.tkit.quarkus.jpa.daos.AbstractDAO;
import org.tkit.quarkus.jpa.exceptions.DAOException;

@ApplicationScoped
@Transactional
public class ImageDAO extends AbstractDAO<Image> {

    public Image findByRefIdAndRefType(String refId, String refType) {

        try {
            var cb = this.getEntityManager().getCriteriaBuilder();
            var cq = this.criteriaQuery();
            var root = cq.from(Image.class);

            cq.where(cb.and(cb.equal(root.get(Image_.refId), refId),
                    cb.equal(root.get(Image_.refType), refType)));

            return this.getEntityManager().createQuery(cq).getSingleResult();
        } catch (NoResultException nre) {
            return null;
        } catch (Exception ex) {
            throw new DAOException(ImageDAO.ErrorKeys.FIND_ENTITY_BY_REF_ID_REF_TYPE_FAILED, ex);
        }
    }

    @Transactional(value = Transactional.TxType.REQUIRED, rollbackOn = DAOException.class)
    public void deleteQueryByRefId(String refId) throws DAOException {
        if (refId == null) {
            return;
        }
        try {
            var cq = deleteQuery();
            var root = cq.from(Image.class);
            var cb = this.getEntityManager().getCriteriaBuilder();

            cq.where(cb.equal(root.get(Image_.REF_ID), refId));
            getEntityManager().createQuery(cq).executeUpdate();
            getEntityManager().flush();
        } catch (Exception e) {
            throw handleConstraint(e, ErrorKeys.FAILED_TO_DELETE_BY_REF_ID_QUERY);
        }
    }

    @Transactional(value = Transactional.TxType.REQUIRED, rollbackOn = DAOException.class)
    public void deleteQueryByRefIds(Collection<String> refIds) throws DAOException {
        try {
            var cq = deleteQuery();
            var root = cq.from(Image.class);
            cq.where(root.get(Image_.REF_ID).in(refIds));
            getEntityManager().createQuery(cq).executeUpdate();
            getEntityManager().flush();
        } catch (Exception e) {
            throw handleConstraint(e, ErrorKeys.FAILED_TO_DELETE_BY_REF_IDS_QUERY);
        }
    }

    public List<Image> findByRefIds(Collection<String> refIds) {
        try {
            var cb = this.getEntityManager().getCriteriaBuilder();
            var cq = cb.createQuery(Image.class);
            var root = cq.from(Image.class);
            if (refIds != null && !refIds.isEmpty()) {
                cq.where(root.get(Image_.REF_ID).in(refIds));
            }
            return this.getEntityManager().createQuery(cq).getResultList();

        } catch (Exception ex) {
            throw new DAOException(ErrorKeys.ERROR_FIND_REF_IDS, ex);
        }
    }

    @Transactional(value = Transactional.TxType.REQUIRED, rollbackOn = DAOException.class)
    public void deleteQueryByRefIdAndRefType(String refId, String refType) throws DAOException {
        try {
            var cq = deleteQuery();
            var root = cq.from(Image.class);
            var cb = this.getEntityManager().getCriteriaBuilder();

            cq.where(cb.and(cb.equal(root.get(Image_.REF_ID), refId)),
                    cb.equal(root.get(Image_.REF_TYPE), refType));
            getEntityManager().createQuery(cq).executeUpdate();
            getEntityManager().flush();
        } catch (Exception e) {
            throw handleConstraint(e, ErrorKeys.FAILED_TO_DELETE_BY_REF_ID_REF_TYPE_QUERY);
        }
    }

    public List<String> findRefIdRefTypesByRefId(Set<String> refIds) {
        try {
            var cb = this.getEntityManager().getCriteriaBuilder();
            var cq = cb.createQuery(String.class);
            var root = cq.from(Image.class);
            cq.select(cb.concat(root.get(Image_.REF_ID), root.get(Image_.REF_TYPE)));
            cq.where(root.get(Image_.REF_ID).in(refIds));
            return this.getEntityManager().createQuery(cq).getResultList();

        } catch (Exception ex) {
            throw new DAOException(ErrorKeys.FIND_REF_TYPES_BY_REF_ID, ex);
        }
    }

    public List<String> findAllTypesByRefId(String refId) {
        try {
            var cb = this.getEntityManager().getCriteriaBuilder();
            var cq = cb.createQuery(String.class);
            var root = cq.from(Image.class);
            cq.select(root.get(Image_.REF_TYPE));
            cq.where(cb.equal(root.get(Image_.REF_ID), refId));
            return this.getEntityManager().createQuery(cq).getResultList();

        } catch (Exception ex) {
            throw new DAOException(ImageDAO.ErrorKeys.ERROR_FIND_ALL_REF_TYPES_BY_REF_ID, ex);
        }
    }

    public enum ErrorKeys {
        ERROR_FIND_REF_IDS,
        FAILED_TO_DELETE_BY_REF_IDS_QUERY,
        FIND_REF_TYPES_BY_REF_ID,
        FAILED_TO_DELETE_BY_REF_ID_QUERY,
        FIND_ENTITY_BY_REF_ID_REF_TYPE_FAILED,
        FAILED_TO_DELETE_BY_REF_ID_REF_TYPE_QUERY,
        ERROR_FIND_ALL_REF_TYPES_BY_REF_ID
    }
}


```

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/daos/ThemeDAO.java

```java

package org.tkit.onecx.theme.domain.daos;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;

import org.tkit.onecx.theme.domain.criteria.ThemeSearchCriteria;
import org.tkit.onecx.theme.domain.models.*;
import org.tkit.quarkus.jpa.daos.AbstractDAO;
import org.tkit.quarkus.jpa.daos.Page;
import org.tkit.quarkus.jpa.daos.PageResult;
import org.tkit.quarkus.jpa.exceptions.DAOException;
import org.tkit.quarkus.jpa.models.AbstractTraceableEntity_;
import org.tkit.quarkus.jpa.models.TraceableEntity_;
import org.tkit.quarkus.jpa.utils.QueryCriteriaUtil;

@ApplicationScoped
public class ThemeDAO extends AbstractDAO<Theme> {

    // https://hibernate.atlassian.net/browse/HHH-16830#icft=HHH-16830
    @Override
    public Theme findById(Object id) throws DAOException {
        try {
            var cb = this.getEntityManager().getCriteriaBuilder();
            var cq = cb.createQuery(Theme.class);
            var root = cq.from(Theme.class);
            cq.where(cb.equal(root.get(TraceableEntity_.ID), id));
            return this.getEntityManager().createQuery(cq).getSingleResult();
        } catch (NoResultException nre) {
            return null;
        } catch (Exception e) {
            throw new DAOException(ErrorKeys.FIND_ENTITY_BY_ID_FAILED, e, entityName, id);
        }
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public Stream<Theme> findThemeByNames(Set<String> themeNames) {
        try {
            var cb = this.getEntityManager().getCriteriaBuilder();
            var cq = cb.createQuery(Theme.class);
            var root = cq.from(Theme.class);

            if (themeNames != null && !themeNames.isEmpty()) {
                cq.where(root.get(Theme_.name).in(themeNames));
            }
            return this.getEntityManager().createQuery(cq).getResultStream();

        } catch (Exception ex) {
            throw new DAOException(ErrorKeys.ERROR_FIND_THEME_BY_NAMES, ex);
        }
    }

    @Transactional(value = Transactional.TxType.REQUIRED, rollbackOn = DAOException.class)
    public void deleteQueryByNames(Collection<String> themeNames) throws DAOException {
        try {
            var cq = deleteQuery();
            var root = cq.from(Theme.class);
            cq.where(root.get(Theme_.NAME).in(themeNames));
            getEntityManager().createQuery(cq).executeUpdate();
            getEntityManager().flush();
        } catch (Exception e) {
            throw handleConstraint(e, ErrorKeys.ERROR_DELETE_QUERY_BY_NAMES);
        }
    }

    public List<String> findNamesByThemeByNames(Set<String> themeNames) {
        try {
            var cb = this.getEntityManager().getCriteriaBuilder();
            var cq = cb.createQuery(String.class);
            var root = cq.from(Theme.class);
            cq.select(root.get(Theme_.name));
            cq.where(root.get(Theme_.name).in(themeNames));
            return this.getEntityManager().createQuery(cq).getResultList();

        } catch (Exception ex) {
            throw new DAOException(ErrorKeys.ERROR_FIND_NAMES_BY_NAMES, ex);
        }
    }

    public PageResult<Theme> findThemesByCriteria(ThemeSearchCriteria criteria) {
        try {
            var cb = this.getEntityManager().getCriteriaBuilder();
            var cq = cb.createQuery(Theme.class);
            var root = cq.from(Theme.class);

            if (criteria.getName() != null && !criteria.getName().isBlank()) {
                cq.where(cb.like(root.get(Theme_.name), QueryCriteriaUtil.wildcard(criteria.getName())));
            }
            cq.orderBy(cb.desc(root.get(AbstractTraceableEntity_.CREATION_DATE)));
            return createPageQuery(cq, Page.of(criteria.getPageNumber(), criteria.getPageSize())).getPageResult();
        } catch (Exception ex) {
            throw new DAOException(ErrorKeys.ERROR_FIND_THEMES_BY_CRITERIA, ex);
        }
    }

    public Stream<ThemeInfo> findAllInfos() {
        try {
            var cb = this.getEntityManager().getCriteriaBuilder();
            var cq = cb.createQuery(ThemeInfo.class);
            var root = cq.from(Theme.class);
            cq.select(cb.construct(ThemeInfo.class, root.get(Theme_.NAME), root.get(Theme_.DESCRIPTION)));
            return this.getEntityManager().createQuery(cq).getResultStream();
        } catch (Exception ex) {
            throw new DAOException(ErrorKeys.ERROR_FIND_ALL_THEME_INFO, ex);
        }
    }

    public Theme findThemeByName(String themeName) {
        try {
            var cb = this.getEntityManager().getCriteriaBuilder();
            var cq = cb.createQuery(Theme.class);
            var root = cq.from(Theme.class);
            cq.where(cb.equal(root.get(Theme_.name), themeName));

            return this.getEntityManager().createQuery(cq).getSingleResult();

        } catch (NoResultException nre) {
            return null;
        } catch (Exception ex) {
            throw new DAOException(ErrorKeys.ERROR_FIND_THEME_BY_NAME, ex);
        }
    }

    public enum ErrorKeys {

        ERROR_DELETE_QUERY_BY_NAMES,
        FIND_ENTITY_BY_ID_FAILED,
        ERROR_FIND_THEMES_BY_CRITERIA,
        ERROR_FIND_ALL_THEME_INFO,
        ERROR_FIND_NAMES_BY_NAMES,
        ERROR_FIND_THEME_BY_NAMES,
        ERROR_FIND_THEME_BY_NAME,
    }
}


```

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/daos/ThemeOverrideDAO.java

```java

package org.tkit.onecx.theme.domain.daos;

import java.util.stream.Stream;

import jakarta.enterprise.context.ApplicationScoped;

import org.tkit.onecx.theme.domain.models.ThemeOverride;
import org.tkit.onecx.theme.domain.models.ThemeOverride_;
import org.tkit.quarkus.jpa.daos.AbstractDAO;
import org.tkit.quarkus.jpa.exceptions.DAOException;

@ApplicationScoped
public class ThemeOverrideDAO extends AbstractDAO<ThemeOverride> {

    public Stream<ThemeOverride> findByThemeId(String themeId) {
        try {
            var cb = this.getEntityManager().getCriteriaBuilder();
            var cq = cb.createQuery(ThemeOverride.class);
            var root = cq.from(ThemeOverride.class);
            cq.where(cb.equal(root.get(ThemeOverride_.THEME_ID), themeId));
            return this.getEntityManager().createQuery(cq).getResultStream();
        } catch (Exception ex) {
            throw new DAOException(ThemeOverrideDAO.ErrorKeys.ERROR_FIND_THEME_OVERRIDES_BY_THEME_ID, ex);
        }
    }

    public enum ErrorKeys {
        ERROR_FIND_THEME_OVERRIDES_BY_THEME_ID
    }

}


```

## Folder: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/di/mappers (1 files)

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/di/mappers/TemplateImportMapper.java

```java

package org.tkit.onecx.theme.domain.di.mappers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import jakarta.inject.Inject;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.tkit.onecx.theme.domain.di.models.ExistingData;
import org.tkit.onecx.theme.domain.models.Image;
import org.tkit.onecx.theme.domain.models.Theme;
import org.tkit.onecx.theme.domain.models.ThemeOverride;
import org.tkit.quarkus.rs.mappers.OffsetDateTimeMapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gen.org.tkit.onecx.theme.di.template.model.TemplateImageDTO;
import gen.org.tkit.onecx.theme.di.template.model.TemplateThemeDTO;
import gen.org.tkit.onecx.theme.di.template.model.TemplateThemeOverrideDTO;

@Mapper(uses = OffsetDateTimeMapper.class)
public abstract class TemplateImportMapper {

    @Inject
    ObjectMapper mapper;

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "properties", qualifiedByName = "o2s")
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "creationUser", ignore = true)
    @Mapping(target = "displayName", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "modificationUser", ignore = true)
    @Mapping(target = "controlTraceabilityManual", ignore = true)
    @Mapping(target = "modificationCount", ignore = true)
    @Mapping(target = "persisted", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "operator", ignore = true)
    public abstract Theme create(String name, TemplateThemeDTO dto);

    public List<Theme> create(ExistingData existingData, Map<String, TemplateThemeDTO> data) {
        return data.entrySet().stream().filter(e -> !existingData.isThemeInDb(e.getKey()))
                .map(e -> create(e.getKey(), e.getValue())).toList();
    }

    public List<Image> createImage(ExistingData existingData, Map<String, TemplateThemeDTO> data) {
        List<Image> result = new ArrayList<>();
        for (Map.Entry<String, TemplateThemeDTO> entry : data.entrySet()) {
            var images = entry.getValue().getImages();
            if (images == null) {
                continue;
            }

            result.addAll(
                    images.entrySet().stream()
                            .filter(e -> !existingData.isRefIdRefTypeInDb(entry.getKey(), e.getKey()))
                            .map(e -> create(entry.getKey(), e.getKey(), e.getValue()))
                            .toList());

        }
        return result;
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "creationUser", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "modificationUser", ignore = true)
    @Mapping(target = "controlTraceabilityManual", ignore = true)
    @Mapping(target = "modificationCount", ignore = true)
    @Mapping(target = "persisted", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "operator", ignore = true)
    @Mapping(target = "length", source = "dto.imageData", qualifiedByName = "length")
    public abstract Image create(String refId, String refType, TemplateImageDTO dto);

    @Named("length")
    public Integer length(byte[] data) {
        if (data == null) {
            return 0;
        }
        return data.length;
    }

    @Named("o2s")
    public String properties(Object properties) {
        if (properties == null) {
            return null;
        }

        try {
            return mapper.writeValueAsString(properties);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    @Mapping(target = "themeId", ignore = true)
    @Mapping(target = "id", ignore = true)
    public abstract ThemeOverride map(TemplateThemeOverrideDTO dto);

    public abstract TemplateThemeOverrideDTO map(ThemeOverride override);

}


```

## Folder: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/di/models (1 files)

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/di/models/ExistingData.java

```java

package org.tkit.onecx.theme.domain.di.models;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ExistingData {

    private final Set<String> names;

    private final Set<String> refTypes;

    public ExistingData(List<String> names, List<String> refTypes) {
        this.names = new HashSet<>(names);
        this.refTypes = new HashSet<>(refTypes);
    }

    public boolean isRefIdRefTypeInDb(String refId, String refType) {
        return refTypes.contains(refId + refType);
    }

    public boolean isThemeInDb(String name) {
        return names.contains(name);
    }
}


```

## Folder: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/di (2 files)

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/di/TemplateImportService.java

```java

package org.tkit.onecx.theme.domain.di;

import java.util.List;
import java.util.Map;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.tkit.onecx.theme.domain.di.mappers.TemplateImportMapper;
import org.tkit.quarkus.dataimport.DataImport;
import org.tkit.quarkus.dataimport.DataImportConfig;
import org.tkit.quarkus.dataimport.DataImportService;

import com.fasterxml.jackson.databind.ObjectMapper;

import gen.org.tkit.onecx.theme.di.template.model.TemplateImportDTO;
import gen.org.tkit.onecx.theme.di.template.model.TemplateThemeDTO;

@DataImport("template")
public class TemplateImportService implements DataImportService {

    private static final Logger log = LoggerFactory.getLogger(TemplateImportService.class);

    @Inject
    ObjectMapper objectMapper;

    @Inject
    TemplateImportMapper mapper;

    @Inject
    ThemeImportService importService;

    @Override
    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public void importData(DataImportConfig config) {
        log.info("Import theme from configuration {}", config);
        try {
            List<String> tenants = List.of();
            var tmp = config.getMetadata().get("tenants");
            if (tmp != null) {
                tenants = List.of(tmp.split(","));
            }

            if (tenants.isEmpty()) {
                log.warn("No tenants defined for the templates");
                return;
            }

            TemplateImportDTO data = objectMapper.readValue(config.getData(), TemplateImportDTO.class);

            if (data.getThemes() == null || data.getThemes().isEmpty()) {
                log.warn("Import configuration key {} does not contains any JSON data to import", config.getKey());
                return;
            }

            // execute the import
            importThemes(tenants, data.getThemes());
        } catch (Exception ex) {
            throw new ImportException(ex.getMessage(), ex);
        }
    }

    public void importThemes(List<String> tenants, Map<String, TemplateThemeDTO> data) {

        // create list of theme names to import
        var names = data.keySet();

        tenants.forEach(tenant -> {
            // load names from the database
            var existingData = importService.getData(tenant, names);

            // filter and create themes to import
            var themes = mapper.create(existingData, data);
            var images = mapper.createImage(existingData, data);

            // create themes in database for tenant
            importService.importTheme(tenant, themes, images);
        });
    }

    public static class ImportException extends RuntimeException {

        public ImportException(String message, Throwable ex) {
            super(message, ex);
        }
    }
}


```

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/di/ThemeImportService.java

```java

package org.tkit.onecx.theme.domain.di;

import java.util.List;
import java.util.Set;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import org.tkit.onecx.theme.domain.daos.ImageDAO;
import org.tkit.onecx.theme.domain.daos.ThemeDAO;
import org.tkit.onecx.theme.domain.di.models.ExistingData;
import org.tkit.onecx.theme.domain.models.Image;
import org.tkit.onecx.theme.domain.models.Theme;
import org.tkit.quarkus.context.ApplicationContext;
import org.tkit.quarkus.context.Context;

@ApplicationScoped
@Transactional(Transactional.TxType.NOT_SUPPORTED)
public class ThemeImportService {

    @Inject
    ThemeDAO dao;

    @Inject
    ImageDAO imageDAO;

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public void importTheme(String tenant, List<Theme> themes, List<Image> images) {
        try {
            var ctx = Context.builder()
                    .principal("data-import")
                    .tenantId(tenant)
                    .build();

            ApplicationContext.start(ctx);

            // create themes
            dao.create(themes);

            // create images
            imageDAO.create(images);

        } finally {
            ApplicationContext.close();
        }
    }

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public ExistingData getData(String tenant, Set<String> names) {
        try {
            var ctx = Context.builder()
                    .principal("data-import")
                    .tenantId(tenant)
                    .build();

            ApplicationContext.start(ctx);
            var tn = dao.findNamesByThemeByNames(names);
            var tr = imageDAO.findRefIdRefTypesByRefId(names);

            return new ExistingData(tn, tr);
        } finally {
            ApplicationContext.close();
        }
    }
}


```

## Folder: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/models (5 files)

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/models/Icon.java

```java

package org.tkit.onecx.theme.domain.models;

import jakarta.persistence.*;

import org.hibernate.annotations.TenantId;
import org.tkit.quarkus.jpa.models.TraceableEntity;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "ICON", uniqueConstraints = {
        @UniqueConstraint(name = "ICON_NAME", columnNames = { "NAME", "REF_ID", "TENANT_ID" })
}, indexes = { @Index(columnList = "REF_ID", name = "ICON_REF_ID_IDX") })
@SuppressWarnings("squid:S2160")
public class Icon extends TraceableEntity {

    @TenantId
    @Column(name = "TENANT_ID")
    private String tenantId;

    @Column(name = "REF_ID")
    private String refId;

    @Column(name = "NAME")
    private String name;

    @Column(name = "TYPE")
    private String type;

    @Column(name = "BODY", columnDefinition = "TEXT")
    private String body;

    @Column(name = "PARENT")
    private String parent;
}


```

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/models/Image.java

```java

package org.tkit.onecx.theme.domain.models;

import jakarta.persistence.*;

import org.hibernate.annotations.TenantId;
import org.tkit.quarkus.jpa.models.TraceableEntity;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "IMAGE", uniqueConstraints = {
        @UniqueConstraint(name = "IMAGE_CONSTRAINTS", columnNames = { "REF_ID", "REF_TYPE", "TENANT_ID" })
})
@SuppressWarnings("squid:S2160")
public class Image extends TraceableEntity {

    @Column(name = "MIME_TYPE")
    private String mimeType;

    @Column(name = "REF_TYPE")
    private String refType;

    @Column(name = "REF_ID")
    private String refId;

    @Column(name = "DATA_LENGTH")
    private Integer length;

    @Column(name = "OPERATOR", nullable = false, columnDefinition = "boolean default false")
    private boolean operator;

    @Column(name = "DATA")
    private byte[] imageData;

    @TenantId
    @Column(name = "TENANT_ID")
    private String tenantId;

}


```

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/models/Theme.java

```java

package org.tkit.onecx.theme.domain.models;

import static jakarta.persistence.CascadeType.*;
import static jakarta.persistence.FetchType.LAZY;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.TenantId;
import org.tkit.quarkus.jpa.models.TraceableEntity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "THEME", uniqueConstraints = {
        @UniqueConstraint(name = "THEME_NAME", columnNames = { "NAME", "TENANT_ID" })
})
@SuppressWarnings("java:S2160")
public class Theme extends TraceableEntity {

    @Column(name = "NAME")
    private String name;

    @Column(name = "DISPLAY_NAME")
    private String displayName;

    @TenantId
    @Column(name = "TENANT_ID")
    private String tenantId;

    @Column(name = "CSS_FILE")
    private String cssFile;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "ASSETS_URL")
    private String assetsUrl;

    @Column(name = "LOGO_URL")
    private String logoUrl;

    @Column(name = "SMALL_LOGO_URL")
    private String smallLogoUrl;

    @Column(name = "FAVICON_URL")
    private String faviconUrl;

    @Column(name = "PREVIEW_IMAGE_URL")
    private String previewImageUrl;

    @Column(name = "ASSETS_UPDATE_DATE")
    private LocalDateTime assetsUpdateDate;

    @Column(name = "PROPERTIES", columnDefinition = "TEXT")
    private String properties;

    @OneToMany(cascade = { REMOVE, REFRESH, PERSIST, MERGE }, fetch = LAZY, orphanRemoval = true)
    @JoinColumn(name = "THEME_ID")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<ThemeOverride> overrides = new ArrayList<>();

    @Column(name = "OPERATOR")
    private Boolean operator;

    @Column(name = "MANDATORY")
    private Boolean mandatory;
}


```

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/models/ThemeInfo.java

```java

package org.tkit.onecx.theme.domain.models;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public record ThemeInfo(String name, String description) {
}


```

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/models/ThemeOverride.java

```java

package org.tkit.onecx.theme.domain.models;

import java.io.Serializable;
import java.util.UUID;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "THEME_OVERRIDE", uniqueConstraints = {
        @UniqueConstraint(name = "OVERRIDE_TYPE", columnNames = { "THEME_ID", "TYPE" })
})
public class ThemeOverride implements Serializable {

    @Id
    @Column(name = "GUID")
    private String id = UUID.randomUUID().toString();

    @Column(name = "THEME_ID", insertable = false, updatable = false)
    private String themeId;

    @Column(name = "TYPE")
    private String type;

    @Column(name = "VALUE")
    private String value;
}


```

## Folder: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/services (2 files)

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/services/IconService.java

```java

package org.tkit.onecx.theme.domain.services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import org.tkit.onecx.theme.domain.daos.IconDAO;
import org.tkit.onecx.theme.domain.models.Icon;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@ApplicationScoped
@Slf4j
public class IconService {

    @Inject
    IconDAO iconDAO;

    public void createIcons(byte[] iconSetData, String refId) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        var jsonData = mapper.readTree(iconSetData);
        String prefix = jsonData.get("prefix").asText();
        var aliases = jsonData.get("aliases");
        var icons = jsonData.get("icons");
        var iconListToCreate = new ArrayList<Icon>();
        icons.forEachEntry((iconName, jsonNode) -> {
            Icon iconToCreate = new Icon();
            iconToCreate.setName(prefix + ":" + iconName);
            iconToCreate.setType("SVG");
            iconToCreate.setRefId(refId);
            iconToCreate.setBody(jsonNode.get("body").asText());
            iconListToCreate.add(iconToCreate);
        });
        aliases.forEachEntry((alias, jsonNode) -> {
            Icon iconToCreate = new Icon();
            iconToCreate.setName(prefix + ":" + alias);
            iconToCreate.setType("SVG");
            iconToCreate.setRefId(refId);
            iconToCreate.setParent(prefix + ":" + jsonNode.get("parent").asText());
            iconListToCreate.add(iconToCreate);
        });
        iconDAO.create(iconListToCreate);
    }

    public List<Icon> resolveAliases(List<Icon> icons) {
        List<Icon> resolvedIcons = new ArrayList<>();
        for (Icon icon : icons) {
            if (icon.getParent() != null) {
                Icon resolvedParent = resolveParentRecursively(icon.getParent(), icon.getRefId());
                if (resolvedParent != null) {
                    icon.setBody(resolvedParent.getBody());
                    icon.setParent(resolvedParent.getName());
                    resolvedIcons.add(icon);
                } else {
                    log.warn("Parent icon '{}' not found for icon '{}' with refId '{}'. Icon will be removed.",
                            icon.getParent(), icon.getName(), icon.getRefId());
                }
            } else {
                resolvedIcons.add(icon);
            }
        }
        return resolvedIcons;
    }

    private Icon resolveParentRecursively(String parentName, String refId) {
        Icon parent = iconDAO.findByNameAndRefId(parentName, refId);
        if (parent == null) {
            return null;
        }
        if (parent.getParent() != null) {
            return resolveParentRecursively(parent.getParent(), refId);
        }
        return parent;
    }
}


```

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/domain/services/ThemeService.java

```java

package org.tkit.onecx.theme.domain.services;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import org.tkit.onecx.theme.domain.daos.IconDAO;
import org.tkit.onecx.theme.domain.daos.ImageDAO;
import org.tkit.onecx.theme.domain.daos.ThemeDAO;
import org.tkit.onecx.theme.domain.models.Image;
import org.tkit.onecx.theme.domain.models.Theme;

@ApplicationScoped
public class ThemeService {

    @Inject
    ThemeDAO themeDAO;

    @Inject
    ThemeDAO dao;

    @Inject
    ImageDAO imageDAO;

    @Inject
    IconDAO iconDAO;

    @Transactional
    public void deleteTheme(String id) {

        var theme = dao.findById(id);
        if (theme != null && !Boolean.TRUE.equals(theme.getMandatory())) {
            dao.delete(theme);
            // workaround for images
            imageDAO.deleteQueryByRefId(theme.getName());
            iconDAO.deleteQueryByRefId(theme.getName());
        }
    }

    @Transactional
    public void importThemes(List<Theme> create, List<Theme> update, List<Image> createImages, List<Image> updateImages) {
        imageDAO.update(updateImages);
        imageDAO.create(createImages);
        themeDAO.create(create);
        themeDAO.update(update);
    }

    @Transactional
    public void importOperator(List<Theme> themes, List<Image> images) {
        if (themes.isEmpty()) {
            return;
        }
        var names = themes.stream().map(Theme::getName).collect(Collectors.toSet());
        // delete existing data
        themeDAO.deleteQueryByNames(names);
        imageDAO.deleteQueryByRefIds(names);

        // create new data
        themeDAO.create(themes);
        imageDAO.create(images);
    }
}


```

## Folder: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/admin/v1/controllers (1 files)

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/admin/v1/controllers/ThemesAdminRestControllerV1.java

```java

package org.tkit.onecx.theme.rs.admin.v1.controllers;

import static jakarta.transaction.Transactional.TxType.NOT_SUPPORTED;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.OptimisticLockException;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;

import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;
import org.tkit.onecx.theme.domain.daos.ThemeDAO;
import org.tkit.onecx.theme.domain.services.ThemeService;
import org.tkit.onecx.theme.rs.admin.v1.mappers.AdminExceptionMapperV1;
import org.tkit.onecx.theme.rs.admin.v1.mappers.AdminThemeMapperV1;
import org.tkit.quarkus.jpa.exceptions.ConstraintException;
import org.tkit.quarkus.log.cdi.LogService;

import gen.org.tkit.onecx.theme.rs.admin.v1.ThemesAdminV1Api;
import gen.org.tkit.onecx.theme.rs.admin.v1.model.CreateThemeRequestDTOAdminV1;
import gen.org.tkit.onecx.theme.rs.admin.v1.model.ProblemDetailResponseDTOAdminV1;
import gen.org.tkit.onecx.theme.rs.admin.v1.model.ThemeSearchCriteriaDTOAdminV1;
import gen.org.tkit.onecx.theme.rs.admin.v1.model.UpdateThemeRequestDTOAdminV1;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@LogService
@ApplicationScoped
@Transactional(value = NOT_SUPPORTED)
public class ThemesAdminRestControllerV1 implements ThemesAdminV1Api {

    @Inject
    ThemeDAO dao;

    @Inject
    ThemeService themeService;

    @Inject
    AdminThemeMapperV1 mapper;

    @Inject
    AdminExceptionMapperV1 exceptionMapper;

    @Override
    public Response createNewTheme(CreateThemeRequestDTOAdminV1 createThemeRequestDTOAdminV1) {
        var theme = mapper.create(createThemeRequestDTOAdminV1.getResource());
        theme = dao.create(theme);
        return Response.status(Response.Status.CREATED)
                .entity(mapper.mapCreate(theme))
                .build();
    }

    @Override
    public Response deleteTheme(String id) {
        themeService.deleteTheme(id);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @Override
    public Response getThemeById(String id) {
        var theme = dao.findById(id);
        if (theme == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(mapper.map(theme)).build();
    }

    @Override
    public Response searchThemes(ThemeSearchCriteriaDTOAdminV1 themeSearchCriteriaDTOAdminV1) {
        var criteria = mapper.map(themeSearchCriteriaDTOAdminV1);
        var result = dao.findThemesByCriteria(criteria);
        return Response.ok(mapper.mapPage(result)).build();
    }

    @Override
    public Response updateTheme(String id, UpdateThemeRequestDTOAdminV1 updateThemeRequestDTOAdminV1) {

        var theme = dao.findById(id);
        if (theme == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        mapper.update(updateThemeRequestDTOAdminV1.getResource(), theme);
        dao.update(theme);
        return Response.noContent().build();
    }

    @ServerExceptionMapper
    public RestResponse<ProblemDetailResponseDTOAdminV1> exception(ConstraintException ex) {
        return exceptionMapper.exception(ex);
    }

    @ServerExceptionMapper
    public RestResponse<ProblemDetailResponseDTOAdminV1> constraint(ConstraintViolationException ex) {
        return exceptionMapper.constraint(ex);
    }

    @ServerExceptionMapper
    public RestResponse<ProblemDetailResponseDTOAdminV1> optimisticLockException(OptimisticLockException ex) {
        return exceptionMapper.optimisticLock(ex);
    }
}


```

## Folder: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/admin/v1/log (1 files)

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/admin/v1/log/AdminThemesLogParamV1.java

```java

package org.tkit.onecx.theme.rs.admin.v1.log;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;

import org.tkit.quarkus.log.cdi.LogParam;

import gen.org.tkit.onecx.theme.rs.admin.v1.model.CreateThemeRequestDTOAdminV1;
import gen.org.tkit.onecx.theme.rs.admin.v1.model.ThemeSearchCriteriaDTOAdminV1;
import gen.org.tkit.onecx.theme.rs.admin.v1.model.UpdateThemeRequestDTOAdminV1;

@ApplicationScoped
public class AdminThemesLogParamV1 implements LogParam {

    @Override
    public List<Item> getClasses() {
        return List.of(
                item(10, CreateThemeRequestDTOAdminV1.class,
                        x -> x.getClass().getSimpleName() + ":" + ((CreateThemeRequestDTOAdminV1) x).getResource().getName()),
                item(10, ThemeSearchCriteriaDTOAdminV1.class, x -> {
                    ThemeSearchCriteriaDTOAdminV1 d = (ThemeSearchCriteriaDTOAdminV1) x;
                    return ThemeSearchCriteriaDTOAdminV1.class.getSimpleName() + "[" + d.getPageNumber() + "," + d.getPageSize()
                            + "]";
                }),
                item(10, UpdateThemeRequestDTOAdminV1.class,
                        x -> x.getClass().getSimpleName() + ":" + ((UpdateThemeRequestDTOAdminV1) x).getResource().getName()));
    }
}


```

## Folder: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/admin/v1/mappers (2 files)

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/admin/v1/mappers/AdminExceptionMapperV1.java

```java

package org.tkit.onecx.theme.rs.admin.v1.mappers;

import java.util.List;
import java.util.Map;
import java.util.Set;

import jakarta.persistence.OptimisticLockException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Path;
import jakarta.ws.rs.core.Response;

import org.jboss.resteasy.reactive.RestResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.tkit.quarkus.jpa.exceptions.ConstraintException;
import org.tkit.quarkus.log.cdi.LogService;
import org.tkit.quarkus.rs.mappers.OffsetDateTimeMapper;

import gen.org.tkit.onecx.theme.rs.admin.v1.model.ProblemDetailInvalidParamDTOAdminV1;
import gen.org.tkit.onecx.theme.rs.admin.v1.model.ProblemDetailParamDTOAdminV1;
import gen.org.tkit.onecx.theme.rs.admin.v1.model.ProblemDetailResponseDTOAdminV1;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Mapper(uses = { OffsetDateTimeMapper.class })
public abstract class AdminExceptionMapperV1 {

    public RestResponse<ProblemDetailResponseDTOAdminV1> constraint(ConstraintViolationException ex) {
        var dto = exception(ErrorKeys.CONSTRAINT_VIOLATIONS.name(), ex.getMessage());
        dto.setInvalidParams(createErrorValidationResponse(ex.getConstraintViolations()));
        return RestResponse.status(Response.Status.BAD_REQUEST, dto);
    }

    public RestResponse<ProblemDetailResponseDTOAdminV1> exception(ConstraintException ex) {
        var dto = exception(ex.getMessageKey().name(), ex.getConstraints());
        dto.setParams(map(ex.namedParameters));
        return RestResponse.status(Response.Status.BAD_REQUEST, dto);
    }

    @LogService(log = false)
    public RestResponse<ProblemDetailResponseDTOAdminV1> optimisticLock(OptimisticLockException ex) {
        var dto = exception(ErrorKeys.OPTIMISTIC_LOCK.name(), ex.getMessage());
        return RestResponse.status(Response.Status.BAD_REQUEST, dto);
    }

    @Mapping(target = "removeParamsItem", ignore = true)
    @Mapping(target = "params", ignore = true)
    @Mapping(target = "invalidParams", ignore = true)
    @Mapping(target = "removeInvalidParamsItem", ignore = true)
    public abstract ProblemDetailResponseDTOAdminV1 exception(String errorCode, String detail);

    public List<ProblemDetailParamDTOAdminV1> map(Map<String, Object> params) {
        if (params == null) {
            return List.of();
        }
        return params.entrySet().stream().map(e -> {
            var item = new ProblemDetailParamDTOAdminV1();
            item.setKey(e.getKey());
            if (e.getValue() != null) {
                item.setValue(e.getValue().toString());
            }
            return item;
        }).toList();
    }

    public abstract List<ProblemDetailInvalidParamDTOAdminV1> createErrorValidationResponse(
            Set<ConstraintViolation<?>> constraintViolation);

    @Mapping(target = "name", source = "propertyPath")
    @Mapping(target = "message", source = "message")
    public abstract ProblemDetailInvalidParamDTOAdminV1 createError(ConstraintViolation<?> constraintViolation);

    public String mapPath(Path path) {
        return path.toString();
    }

    public enum ErrorKeys {

        OPTIMISTIC_LOCK,
        CONSTRAINT_VIOLATIONS;
    }
}


```

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/admin/v1/mappers/AdminThemeMapperV1.java

```java

package org.tkit.onecx.theme.rs.admin.v1.mappers;

import java.util.List;
import java.util.stream.Stream;

import jakarta.inject.Inject;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.tkit.onecx.theme.domain.criteria.ThemeSearchCriteria;
import org.tkit.onecx.theme.domain.models.Theme;
import org.tkit.onecx.theme.domain.models.ThemeOverride;
import org.tkit.quarkus.jpa.daos.PageResult;
import org.tkit.quarkus.rs.mappers.OffsetDateTimeMapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gen.org.tkit.onecx.theme.rs.admin.v1.model.*;

@Mapper(uses = { OffsetDateTimeMapper.class })
public abstract class AdminThemeMapperV1 {

    @Inject
    ObjectMapper mapper;

    public abstract ThemeSearchCriteria map(ThemeSearchCriteriaDTOAdminV1 dto);

    @Mapping(target = "removeStreamItem", ignore = true)
    public abstract ThemePageResultDTOAdminV1 mapPage(PageResult<Theme> page);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "controlTraceabilityManual", ignore = true)
    @Mapping(target = "modificationCount", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "creationUser", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "modificationUser", ignore = true)
    @Mapping(target = "persisted", ignore = true)
    @Mapping(target = "properties", qualifiedByName = "o2s")
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "operator", ignore = true)
    public abstract Theme create(CreateThemeDTOAdminV1 object);

    public abstract List<ThemeDTOAdminV1> map(Stream<Theme> entity);

    @Mapping(target = "resource.properties", qualifiedByName = "s2o")
    @Mapping(target = "resource", source = "theme")
    public abstract CreateThemeResponseDTOAdminV1 mapCreate(Theme theme);

    @Mapping(target = "removeOverridesItem", ignore = true)
    @Mapping(target = "overrides", ignore = true)
    public abstract ThemeDTOAdminV1 map(Theme theme);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "creationUser", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "modificationUser", ignore = true)
    @Mapping(target = "controlTraceabilityManual", ignore = true)
    @Mapping(target = "persisted", ignore = true)
    @Mapping(target = "properties", qualifiedByName = "o2s")
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "operator", ignore = true)
    public abstract void update(UpdateThemeDTOAdminV1 themeDTOAdminV1, @MappingTarget Theme entity);

    @Mapping(target = "themeId", ignore = true)
    @Mapping(target = "id", ignore = true)
    public abstract ThemeOverride map(ThemeOverrideDTOAdminV1 dto);

    public abstract ThemeOverrideDTOAdminV1 map(ThemeOverride override);

    @Named("o2s")
    public String mapToString(Object properties) {

        if (properties == null) {
            return null;
        }

        try {
            return mapper.writeValueAsString(properties);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    @Named("s2o")
    public Object stringToObject(String jsonVar) {

        if (jsonVar == null || jsonVar.isEmpty()) {
            return null;
        }

        try {
            return mapper.readTree(jsonVar);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

}


```

## Folder: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/exim/v1/controllers (1 files)

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/exim/v1/controllers/ExportImportRestControllerV1.java

```java

package org.tkit.onecx.theme.rs.exim.v1.controllers;

import static org.tkit.onecx.theme.rs.exim.v1.mappers.ExportImportMapperV1.imageId;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;

import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;
import org.tkit.onecx.theme.domain.daos.ImageDAO;
import org.tkit.onecx.theme.domain.daos.ThemeDAO;
import org.tkit.onecx.theme.domain.models.Image;
import org.tkit.onecx.theme.domain.models.Theme;
import org.tkit.onecx.theme.domain.services.ThemeService;
import org.tkit.onecx.theme.rs.exim.v1.mappers.ExportImportExceptionMapperV1;
import org.tkit.onecx.theme.rs.exim.v1.mappers.ExportImportMapperV1;
import org.tkit.quarkus.log.cdi.LogService;

import gen.org.tkit.onecx.theme.rs.exim.v1.ThemesExportImportApi;
import gen.org.tkit.onecx.theme.rs.exim.v1.model.*;

@LogService
@ApplicationScoped
@Transactional(Transactional.TxType.NOT_SUPPORTED)
public class ExportImportRestControllerV1 implements ThemesExportImportApi {

    @Inject
    ImageDAO imageDAO;

    @Inject
    ThemeDAO dao;
    @Inject
    ExportImportExceptionMapperV1 exceptionMapper;

    @Inject
    ExportImportMapperV1 mapper;

    @Inject
    ThemeService themeService;

    @Override
    public Response exportThemes(ExportThemeRequestDTOV1 request) {
        var themes = dao.findThemeByNames(request.getNames());

        var data = themes.collect(Collectors.toMap(Theme::getName, theme -> theme));

        if (data.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        var images = imageDAO.findByRefIds(request.getNames());

        return Response.ok(mapper.create(data, images)).build();
    }

    @Override
    public Response importThemes(ThemeSnapshotDTOV1 request) {
        var names = request.getThemes().keySet();
        var themes = dao.findThemeByNames(names);
        var map = themes.collect(Collectors.toMap(Theme::getName, theme -> theme));

        var images = imageDAO.findByRefIds(names);
        var imagesMap = images.stream().collect(Collectors.toMap(ExportImportMapperV1::imageId, i -> i));

        Map<String, ImportThemeResponseStatusDTOV1> items = new HashMap<>();
        List<Theme> create = new ArrayList<>();
        List<Theme> update = new ArrayList<>();

        List<Image> createImages = new ArrayList<>();
        List<Image> updateImages = new ArrayList<>();

        request.getThemes().forEach((name, dto) -> {
            var theme = map.get(name);
            if (theme == null) {
                theme = mapper.create(name, dto);
                create.add(theme);
                createImages.addAll(mapper.createImages(name, dto.getImages()));
                items.put(name, ImportThemeResponseStatusDTOV1.CREATED);
            } else {
                mapper.update(dto, theme);
                update.add(theme);

                if (dto.getImages() != null) {
                    dto.getImages().forEach((refType, imageDto) -> {
                        var image = imagesMap.get(imageId(name, refType));
                        if (image == null) {
                            createImages.add(mapper.createImage(name, refType, imageDto));
                        } else {
                            updateImages.add(mapper.updateImage(image, imageDto));
                        }
                    });
                }

                items.put(name, ImportThemeResponseStatusDTOV1.UPDATE);
            }
        });

        themeService.importThemes(create, update, createImages, updateImages);

        return Response.ok(mapper.create(request, items)).build();
    }

    @Override
    public Response operatorImportThemes(ThemeSnapshotDTOV1 request) {

        if (request.getThemes() == null) {
            return Response.ok().build();
        }

        List<Theme> themes = new ArrayList<>();
        List<Image> images = new ArrayList<>();
        request.getThemes().forEach((name, dto) -> {
            var theme = mapper.create(name, dto);
            theme.setOperator(true);
            themes.add(theme);
            var items = mapper.createImages(name, dto.getImages());
            items.forEach(x -> x.setOperator(true));
            images.addAll(items);
        });
        themeService.importOperator(themes, images);
        return Response.ok().build();
    }

    @ServerExceptionMapper
    public RestResponse<EximProblemDetailResponseDTOV1> constraint(ConstraintViolationException ex) {
        return exceptionMapper.constraint(ex);
    }
}


```

## Folder: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/exim/v1/log (1 files)

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/exim/v1/log/ExportImportLogParam.java

```java

package org.tkit.onecx.theme.rs.exim.v1.log;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;

import org.tkit.quarkus.log.cdi.LogParam;

import gen.org.tkit.onecx.theme.rs.exim.v1.model.ExportThemeRequestDTOV1;
import gen.org.tkit.onecx.theme.rs.exim.v1.model.ThemeSnapshotDTOV1;

@ApplicationScoped
public class ExportImportLogParam implements LogParam {

    @Override
    public List<Item> getClasses() {
        return List.of(
                item(10, ExportThemeRequestDTOV1.class, x -> x.getClass().getSimpleName()),
                item(10, ThemeSnapshotDTOV1.class,
                        x -> x.getClass().getSimpleName() + ":" + ((ThemeSnapshotDTOV1) x).getId()));
    }
}


```

## Folder: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/exim/v1/mappers (2 files)

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/exim/v1/mappers/ExportImportExceptionMapperV1.java

```java

package org.tkit.onecx.theme.rs.exim.v1.mappers;

import java.util.List;
import java.util.Map;
import java.util.Set;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Path;
import jakarta.ws.rs.core.Response;

import org.jboss.resteasy.reactive.RestResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.tkit.quarkus.rs.mappers.OffsetDateTimeMapper;

import gen.org.tkit.onecx.theme.rs.exim.v1.model.*;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Mapper(uses = { OffsetDateTimeMapper.class })
public abstract class ExportImportExceptionMapperV1 {

    public RestResponse<EximProblemDetailResponseDTOV1> constraint(ConstraintViolationException ex) {
        var dto = exception("CONSTRAINT_VIOLATIONS", ex.getMessage());
        dto.setInvalidParams(createErrorValidationResponse(ex.getConstraintViolations()));
        return RestResponse.status(Response.Status.BAD_REQUEST, dto);
    }

    @Mapping(target = "removeParamsItem", ignore = true)
    @Mapping(target = "params", ignore = true)
    @Mapping(target = "invalidParams", ignore = true)
    @Mapping(target = "removeInvalidParamsItem", ignore = true)
    public abstract EximProblemDetailResponseDTOV1 exception(String errorCode, String detail);

    public List<EximProblemDetailParamDTOV1> map(Map<String, Object> params) {
        if (params == null) {
            return List.of();
        }
        return params.entrySet().stream().map(e -> {
            var item = new EximProblemDetailParamDTOV1();
            item.setKey(e.getKey());
            if (e.getValue() != null) {
                item.setValue(e.getValue().toString());
            }
            return item;
        }).toList();
    }

    public abstract List<EximProblemDetailInvalidParamDTOV1> createErrorValidationResponse(
            Set<ConstraintViolation<?>> constraintViolation);

    @Mapping(target = "name", source = "propertyPath")
    @Mapping(target = "message", source = "message")
    public abstract EximProblemDetailInvalidParamDTOV1 createError(ConstraintViolation<?> constraintViolation);

    public String mapPath(Path path) {
        return path.toString();
    }
}


```

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/exim/v1/mappers/ExportImportMapperV1.java

```java

package org.tkit.onecx.theme.rs.exim.v1.mappers;

import java.time.OffsetDateTime;
import java.util.*;

import jakarta.inject.Inject;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.tkit.onecx.theme.domain.models.Image;
import org.tkit.onecx.theme.domain.models.Theme;
import org.tkit.onecx.theme.domain.models.ThemeOverride;
import org.tkit.quarkus.rs.mappers.OffsetDateTimeMapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gen.org.tkit.onecx.theme.rs.exim.v1.model.*;

@Mapper(uses = { OffsetDateTimeMapper.class })
public abstract class ExportImportMapperV1 {

    @Inject
    ObjectMapper objectMapper;

    public List<Image> createImages(String themeName, Map<String, ImageDTOV1> images) {
        if (images == null) {
            return List.of();
        }
        List<Image> result = new ArrayList<>();
        images.forEach((refType, dto) -> result.add(createImage(themeName, refType, dto)));
        return result;
    }

    public Image updateImage(Image image, ImageDTOV1 dto) {
        image.setImageData(dto.getImageData());
        image.setMimeType(dto.getMimeType());
        image.setLength(length(dto.getImageData()));
        return image;
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "creationUser", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "modificationUser", ignore = true)
    @Mapping(target = "controlTraceabilityManual", ignore = true)
    @Mapping(target = "modificationCount", ignore = true)
    @Mapping(target = "persisted", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "operator", ignore = true)
    @Mapping(target = "length", source = "dto.imageData", qualifiedByName = "length")
    public abstract Image createImage(String refId, String refType, ImageDTOV1 dto);

    @Mapping(target = "id", source = "request.id")
    @Mapping(target = "themes", source = "themes")
    @Mapping(target = "removeThemesItem", ignore = true)
    public abstract ImportThemeResponseDTOV1 create(ThemeSnapshotDTOV1 request,
            Map<String, ImportThemeResponseStatusDTOV1> themes);

    public ThemeSnapshotDTOV1 create(Map<String, Theme> data, List<Image> images) {
        if (data == null) {
            return null;
        }
        var imagesMap = createImages(images);

        ThemeSnapshotDTOV1 result = new ThemeSnapshotDTOV1();
        result.setId(UUID.randomUUID().toString());
        result.setCreated(OffsetDateTime.now());
        result.setThemes(map(data, imagesMap));
        return result;
    }

    public Map<String, EximThemeDTOV1> map(Map<String, Theme> data, Map<String, Map<String, ImageDTOV1>> images) {
        if (data == null) {
            return Map.of();
        }

        Map<String, EximThemeDTOV1> map = new HashMap<>();
        data.forEach((name, value) -> {
            EximThemeDTOV1 dto = map(value);
            dto.setImages(images.get(name));
            map.put(name, dto);
        });
        return map;
    }

    Map<String, Map<String, ImageDTOV1>> createImages(List<Image> images) {
        if (images == null) {
            return Map.of();
        }
        Map<String, Map<String, ImageDTOV1>> result = new HashMap<>();
        images.forEach(image -> result.computeIfAbsent(image.getRefId(), k -> new HashMap<>())
                .put(image.getRefType(), createImage(image)));
        return result;
    }

    public abstract ImageDTOV1 createImage(Image image);

    @Mapping(target = "removeOverridesItem", ignore = true)
    @Mapping(target = "properties", qualifiedByName = "s2o")
    @Mapping(target = "removeImagesItem", ignore = true)
    @Mapping(target = "images", ignore = true)
    public abstract EximThemeDTOV1 map(Theme theme);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "creationUser", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "modificationUser", ignore = true)
    @Mapping(target = "controlTraceabilityManual", ignore = true)
    @Mapping(target = "modificationCount", ignore = true)
    @Mapping(target = "persisted", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "operator", ignore = true)
    @Mapping(target = "properties", qualifiedByName = "o2s")
    public abstract void update(EximThemeDTOV1 dto, @MappingTarget Theme entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "creationUser", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "modificationUser", ignore = true)
    @Mapping(target = "controlTraceabilityManual", ignore = true)
    @Mapping(target = "modificationCount", ignore = true)
    @Mapping(target = "persisted", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "operator", ignore = true)
    @Mapping(target = "properties", qualifiedByName = "o2s")
    @Mapping(target = "displayName", source = "dto.displayName", defaultExpression = "java(name)")
    public abstract Theme create(String name, EximThemeDTOV1 dto);

    @Mapping(target = "themeId", ignore = true)
    @Mapping(target = "id", ignore = true)
    public abstract ThemeOverride map(EximThemeOverrideDTOV1 dto);

    public abstract EximThemeOverrideDTOV1 map(ThemeOverride override);

    @Named("o2s")
    public String mapToString(Object properties) {

        if (properties == null) {
            return null;
        }

        try {
            return objectMapper.writeValueAsString(properties);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    @Named("s2o")
    public Object stringToObject(String jsonVar) {

        if (jsonVar == null || jsonVar.isEmpty()) {
            return null;
        }

        try {
            return objectMapper.readTree(jsonVar);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    @Named("length")
    public Integer length(byte[] data) {
        if (data == null) {
            return 0;
        }
        return data.length;
    }

    public static String imageId(Image image) {
        return imageId(image.getRefId(), image.getRefType());
    }

    public static String imageId(String refId, String refType) {
        return refId + "#" + refType;
    }
}


```

## Folder: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/external/v1/controllers (2 files)

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/external/v1/controllers/IconRestControllerV1.java

```java

package org.tkit.onecx.theme.rs.external.v1.controllers;

import java.util.HashSet;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;

import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;
import org.tkit.onecx.theme.domain.daos.IconDAO;
import org.tkit.onecx.theme.domain.services.IconService;
import org.tkit.onecx.theme.rs.external.v1.mappers.ExceptionMapper;
import org.tkit.onecx.theme.rs.external.v1.mappers.IconMapper;
import org.tkit.quarkus.log.cdi.LogService;

import gen.org.tkit.onecx.theme.rs.icon.v1.IconsV1Api;
import gen.org.tkit.onecx.theme.rs.icon.v1.model.IconCriteriaDTOV1;
import gen.org.tkit.onecx.theme.rs.icon.v1.model.IconListResponseDTOV1;
import gen.org.tkit.onecx.theme.rs.icon.v1.model.ProblemDetailResponseDTOV1;

@LogService
@ApplicationScoped
@Transactional(Transactional.TxType.NOT_SUPPORTED)
public class IconRestControllerV1 implements IconsV1Api {

    @Inject
    IconDAO iconDAO;

    @Inject
    IconService iconService;

    @Inject
    IconMapper iconMapper;

    @Inject
    ExceptionMapper exceptionMapper;

    @Override
    public Response findIconsByNamesAndRefId(String refId, IconCriteriaDTOV1 iconCriteriaDTO) {
        var icons = iconDAO.findIconsByNamesAndRefId(new HashSet<>(iconCriteriaDTO.getNames()), refId).toList();
        icons = iconService.resolveAliases(icons);

        IconListResponseDTOV1 res = new IconListResponseDTOV1();
        res.setIcons(iconMapper.mapList(icons));
        return Response.ok(res).build();
    }

    @ServerExceptionMapper
    public RestResponse<ProblemDetailResponseDTOV1> constraint(ConstraintViolationException ex) {
        return exceptionMapper.constraint(ex);
    }
}


```

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/external/v1/controllers/ThemesRestControllerV1.java

```java

package org.tkit.onecx.theme.rs.external.v1.controllers;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;

import org.tkit.onecx.theme.domain.daos.ImageDAO;
import org.tkit.onecx.theme.domain.daos.ThemeDAO;
import org.tkit.onecx.theme.domain.models.Image;
import org.tkit.onecx.theme.rs.external.v1.mappers.ThemeMapper;
import org.tkit.quarkus.log.cdi.LogService;

import gen.org.tkit.onecx.theme.rs.external.v1.ThemesV1Api;
import gen.org.tkit.onecx.theme.rs.external.v1.model.AvailableImageTypesDTOV1;

@LogService
@ApplicationScoped
@Transactional(Transactional.TxType.NOT_SUPPORTED)
public class ThemesRestControllerV1 implements ThemesV1Api {

    @Inject
    ThemeDAO dao;

    @Inject
    ImageDAO imageDAO;

    @Inject
    ThemeMapper mapper;

    @Override
    public Response getAvailableImageTypes(String refId) {
        var availableTypes = imageDAO.findAllTypesByRefId(refId);
        AvailableImageTypesDTOV1 availableImageTypesDTO = new AvailableImageTypesDTOV1();
        availableImageTypesDTO.setTypes(availableTypes);
        return Response.ok(availableImageTypesDTO).build();
    }

    @Override
    public Response getThemeByName(String name) {
        var theme = dao.findThemeByName(name);
        if (theme == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(mapper.map(theme)).build();
    }

    @Override
    public Response getThemeFaviconByName(String name) {
        Image image = imageDAO.findByRefIdAndRefType(name, "favicon");
        if (image == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(image.getImageData(), image.getMimeType())
                .header(HttpHeaders.CONTENT_LENGTH, image.getLength()).build();
    }

    @Override
    public Response getThemeImageByNameAndRefType(String name, String refType) {
        Image image = imageDAO.findByRefIdAndRefType(name, refType);
        if (image == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(image.getImageData(), image.getMimeType())
                .header(HttpHeaders.CONTENT_LENGTH, image.getLength()).build();
    }

    @Override
    public Response getThemeLogoByName(String name, Boolean small) {
        String refType = "logo";
        if (Boolean.TRUE.equals(small)) {
            refType = "logo-small";
        }
        Image image = imageDAO.findByRefIdAndRefType(name, refType);
        if (image == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(image.getImageData(), image.getMimeType())
                .header(HttpHeaders.CONTENT_LENGTH, image.getLength()).build();
    }

    @Override
    public Response getThemesInfo() {
        var items = dao.findAllInfos();
        return Response.ok(mapper.mapInfoList(items)).build();
    }

}


```

## Folder: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/external/v1/mappers (3 files)

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/external/v1/mappers/ExceptionMapper.java

```java

package org.tkit.onecx.theme.rs.external.v1.mappers;

import java.util.List;
import java.util.Map;
import java.util.Set;

import jakarta.persistence.OptimisticLockException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Path;
import jakarta.ws.rs.core.Response;

import org.jboss.resteasy.reactive.RestResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.tkit.quarkus.jpa.exceptions.ConstraintException;
import org.tkit.quarkus.log.cdi.LogService;
import org.tkit.quarkus.rs.mappers.OffsetDateTimeMapper;

import gen.org.tkit.onecx.theme.rs.icon.v1.model.ProblemDetailInvalidParamDTOV1;
import gen.org.tkit.onecx.theme.rs.icon.v1.model.ProblemDetailParamDTOV1;
import gen.org.tkit.onecx.theme.rs.icon.v1.model.ProblemDetailResponseDTOV1;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Mapper(uses = { OffsetDateTimeMapper.class })
public abstract class ExceptionMapper {

    public RestResponse<ProblemDetailResponseDTOV1> constraint(ConstraintViolationException ex) {
        var dto = exception(ErrorKeys.CONSTRAINT_VIOLATIONS.name(), ex.getMessage());
        dto.setInvalidParams(createErrorValidationResponse(ex.getConstraintViolations()));
        return RestResponse.status(Response.Status.BAD_REQUEST, dto);
    }

    public RestResponse<ProblemDetailResponseDTOV1> exception(ConstraintException ex) {
        var dto = exception(ex.getMessageKey().name(), ex.getConstraints());
        dto.setParams(map(ex.namedParameters));
        return RestResponse.status(Response.Status.BAD_REQUEST, dto);
    }

    @LogService(log = false)
    public RestResponse<ProblemDetailResponseDTOV1> optimisticLock(OptimisticLockException ex) {
        var dto = exception(ErrorKeys.OPTIMISTIC_LOCK.name(), ex.getMessage());
        return RestResponse.status(Response.Status.BAD_REQUEST, dto);
    }

    @Mapping(target = "removeParamsItem", ignore = true)
    @Mapping(target = "params", ignore = true)
    @Mapping(target = "invalidParams", ignore = true)
    @Mapping(target = "removeInvalidParamsItem", ignore = true)
    public abstract ProblemDetailResponseDTOV1 exception(String errorCode, String detail);

    public List<ProblemDetailParamDTOV1> map(Map<String, Object> params) {
        if (params == null) {
            return List.of();
        }
        return params.entrySet().stream().map(e -> {
            var item = new ProblemDetailParamDTOV1();
            item.setKey(e.getKey());
            if (e.getValue() != null) {
                item.setValue(e.getValue().toString());
            }
            return item;
        }).toList();
    }

    public abstract List<ProblemDetailInvalidParamDTOV1> createErrorValidationResponse(
            Set<ConstraintViolation<?>> constraintViolation);

    @Mapping(target = "name", source = "propertyPath")
    @Mapping(target = "message", source = "message")
    public abstract ProblemDetailInvalidParamDTOV1 createError(ConstraintViolation<?> constraintViolation);

    public String mapPath(Path path) {
        return path.toString();
    }

    public enum ErrorKeys {

        OPTIMISTIC_LOCK,
        CONSTRAINT_VIOLATIONS;
    }
}


```

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/external/v1/mappers/IconMapper.java

```java

package org.tkit.onecx.theme.rs.external.v1.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.tkit.onecx.theme.domain.models.Icon;
import org.tkit.quarkus.rs.mappers.OffsetDateTimeMapper;

import gen.org.tkit.onecx.theme.rs.icon.v1.model.IconDTOV1;

@Mapper(uses = OffsetDateTimeMapper.class)
public interface IconMapper {
    List<IconDTOV1> mapList(List<Icon> icons);

    IconDTOV1 map(Icon icon);
}


```

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/external/v1/mappers/ThemeMapper.java

```java

package org.tkit.onecx.theme.rs.external.v1.mappers;

import java.util.List;
import java.util.stream.Stream;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.tkit.onecx.theme.domain.models.Theme;
import org.tkit.onecx.theme.domain.models.ThemeInfo;
import org.tkit.onecx.theme.domain.models.ThemeOverride;
import org.tkit.quarkus.rs.mappers.OffsetDateTimeMapper;

import gen.org.tkit.onecx.theme.rs.external.v1.model.*;

@Mapper(uses = { OffsetDateTimeMapper.class })
public interface ThemeMapper {

    @Mapping(target = "removeOverridesItem", ignore = true)
    ThemeDTOV1 map(Theme theme);

    default ThemeInfoListDTOV1 mapInfoList(Stream<ThemeInfo> data) {
        var result = new ThemeInfoListDTOV1();
        result.setThemes(mapInfo(data));
        return result;
    }

    List<ThemeInfoDTOV1> mapInfo(Stream<ThemeInfo> page);

    @Mapping(target = "themeId", ignore = true)
    @Mapping(target = "id", ignore = true)
    ThemeOverride map(ThemeOverrideDTOV1 dto);
}


```

## Folder: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/internal/controllers (3 files)

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/internal/controllers/IconRestController.java

```java

package org.tkit.onecx.theme.rs.internal.controllers;

import java.io.IOException;
import java.util.HashSet;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;

import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;
import org.tkit.onecx.theme.domain.daos.IconDAO;
import org.tkit.onecx.theme.domain.services.IconService;
import org.tkit.onecx.theme.rs.internal.mappers.ExceptionMapper;
import org.tkit.onecx.theme.rs.internal.mappers.IconMapper;
import org.tkit.quarkus.jpa.exceptions.ConstraintException;
import org.tkit.quarkus.log.cdi.LogService;

import gen.org.tkit.onecx.theme.rs.icon.internal.IconsInternalApi;
import gen.org.tkit.onecx.theme.rs.icon.internal.model.IconCriteriaDTO;
import gen.org.tkit.onecx.theme.rs.icon.internal.model.IconListResponseDTO;
import gen.org.tkit.onecx.theme.rs.internal.model.ProblemDetailResponseDTO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@LogService
@ApplicationScoped
public class IconRestController implements IconsInternalApi {

    @Inject
    IconService iconService;

    @Inject
    IconDAO iconDAO;

    @Inject
    IconMapper iconMapper;

    @Inject
    ExceptionMapper exceptionMapper;

    @Override
    public Response uploadIconSet(String refId, byte[] body) {
        try {
            iconService.createIcons(body, refId);
        } catch (IOException e) {
            log.error("Error uploading icon set for refId {}: {}", refId, e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        return Response.status(Response.Status.CREATED).build();
    }

    @Override
    public Response findIconsByNamesAndRefId(String refId, IconCriteriaDTO iconCriteriaDTO) {
        var icons = iconDAO.findIconsByNamesAndRefId(new HashSet<>(iconCriteriaDTO.getNames()), refId).toList();
        icons = iconService.resolveAliases(icons);

        IconListResponseDTO res = new IconListResponseDTO();
        res.setIcons(iconMapper.mapList(icons));
        return Response.ok(res).build();
    }

    @ServerExceptionMapper
    public RestResponse<ProblemDetailResponseDTO> exception(ConstraintException ex) {
        return exceptionMapper.exception(ex);
    }

    @ServerExceptionMapper
    public RestResponse<ProblemDetailResponseDTO> constraint(ConstraintViolationException ex) {
        return exceptionMapper.constraint(ex);
    }
}


```

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/internal/controllers/ImageRestController.java

```java

package org.tkit.onecx.theme.rs.internal.controllers;

import static jakarta.transaction.Transactional.TxType.NOT_SUPPORTED;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.*;

import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;
import org.tkit.onecx.theme.domain.daos.ImageDAO;
import org.tkit.onecx.theme.domain.models.Image;
import org.tkit.onecx.theme.rs.internal.mappers.ExceptionMapper;
import org.tkit.onecx.theme.rs.internal.mappers.ImageMapper;
import org.tkit.quarkus.log.cdi.LogService;

import gen.org.tkit.onecx.image.rs.internal.ImagesInternalApi;
import gen.org.tkit.onecx.image.rs.internal.model.AvailableImageTypesDTO;
import gen.org.tkit.onecx.image.rs.internal.model.MimeTypeDTO;
import gen.org.tkit.onecx.theme.rs.internal.model.ProblemDetailResponseDTO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@LogService
@ApplicationScoped
@Transactional(value = NOT_SUPPORTED)
public class ImageRestController implements ImagesInternalApi {

    @Inject
    ExceptionMapper exceptionMapper;

    @Inject
    ImageDAO imageDAO;

    @Context
    UriInfo uriInfo;

    @Inject
    ImageMapper imageMapper;

    @Override
    public Response getImage(String refId, String refType) {
        Image image = imageDAO.findByRefIdAndRefType(refId, refType);
        if (image == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(image.getImageData(), image.getMimeType())
                .header(HttpHeaders.CONTENT_LENGTH, image.getLength()).build();
    }

    @Override
    public Response uploadImage(Integer contentLength, String refId, String refType, MimeTypeDTO mimeType, byte[] body) {
        Image image = imageDAO.findByRefIdAndRefType(refId, refType);
        if (image == null) {
            image = imageMapper.create(refId, refType, mimeType.toString(), contentLength, body);
            image = imageDAO.create(image);
        } else {
            imageMapper.update(image, contentLength, mimeType.toString(), body);
            image = imageDAO.update(image);
        }
        var imageInfoDTO = imageMapper.map(image);
        return Response.created(uriInfo.getAbsolutePathBuilder().path(imageInfoDTO.getId()).build())
                .entity(imageInfoDTO)
                .build();
    }

    @Override
    public Response deleteImagesById(String refId) {

        imageDAO.deleteQueryByRefId(refId);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @Override
    public Response getAvailableImageTypes(String refId) {
        var availableTypes = imageDAO.findAllTypesByRefId(refId);
        AvailableImageTypesDTO availableImageTypesDTO = new AvailableImageTypesDTO();
        availableImageTypesDTO.setTypes(availableTypes);
        return Response.ok(availableImageTypesDTO).build();
    }

    @Override
    public Response deleteImage(String refId, String refType) {
        imageDAO.deleteQueryByRefIdAndRefType(refId, refType);

        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @ServerExceptionMapper
    public RestResponse<ProblemDetailResponseDTO> constraint(ConstraintViolationException ex) {
        return exceptionMapper.constraint(ex);
    }
}


```

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/internal/controllers/ThemesRestController.java

```java

package org.tkit.onecx.theme.rs.internal.controllers;

import static jakarta.transaction.Transactional.TxType.NOT_SUPPORTED;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.OptimisticLockException;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;

import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;
import org.tkit.onecx.theme.domain.daos.ThemeDAO;
import org.tkit.onecx.theme.domain.daos.ThemeOverrideDAO;
import org.tkit.onecx.theme.domain.services.ThemeService;
import org.tkit.onecx.theme.rs.internal.mappers.ExceptionMapper;
import org.tkit.onecx.theme.rs.internal.mappers.ThemeMapper;
import org.tkit.quarkus.jpa.exceptions.ConstraintException;
import org.tkit.quarkus.log.cdi.LogService;

import gen.org.tkit.onecx.theme.rs.internal.ThemesInternalApi;
import gen.org.tkit.onecx.theme.rs.internal.model.*;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@LogService
@ApplicationScoped
@Transactional(value = NOT_SUPPORTED)
public class ThemesRestController implements ThemesInternalApi {

    @Inject
    ThemeDAO dao;

    @Inject
    ThemeOverrideDAO overrideDAO;

    @Inject
    ThemeService themeService;

    @Inject
    ThemeMapper mapper;

    @Inject
    ExceptionMapper exceptionMapper;

    @Context
    UriInfo uriInfo;

    @Override
    public Response createNewTheme(CreateThemeDTO createThemeDTO) {
        var theme = mapper.create(createThemeDTO);
        theme = dao.create(theme);
        return Response
                .created(uriInfo.getAbsolutePathBuilder().path(theme.getId()).build())
                .entity(mapper.map(theme))
                .build();
    }

    @Override
    public Response deleteTheme(String id) {
        themeService.deleteTheme(id);

        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @Override
    public Response getThemeInfoList() {
        var items = dao.findAllInfos();
        return Response.ok(mapper.mapInfoList(items)).build();
    }

    @Override
    public Response getThemeById(String id) {
        var theme = dao.findById(id);
        if (theme == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        var mappedTheme = mapper.map(theme);
        overrideDAO.findByThemeId(theme.getId()).forEach(o -> mappedTheme.getOverrides().add(mapper.map(o)));
        return Response.ok(mappedTheme).build();
    }

    @Override
    public Response getThemeByThemeDefinitionName(String name) {
        var theme = dao.findThemeByName(name);
        if (theme == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(mapper.map(theme)).build();
    }

    @Override
    public Response searchThemes(ThemeSearchCriteriaDTO themeSearchCriteriaDTO) {
        var criteria = mapper.map(themeSearchCriteriaDTO);
        var result = dao.findThemesByCriteria(criteria);
        return Response.ok(mapper.mapPage(result)).build();
    }

    @Override
    public Response updateTheme(String id, UpdateThemeDTO updateThemeDTO) {

        var theme = dao.findById(id);
        if (theme == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        mapper.update(updateThemeDTO, theme);
        dao.update(theme);
        return Response.noContent().build();
    }

    @ServerExceptionMapper
    public RestResponse<ProblemDetailResponseDTO> exception(ConstraintException ex) {
        return exceptionMapper.exception(ex);
    }

    @ServerExceptionMapper
    public RestResponse<ProblemDetailResponseDTO> constraint(ConstraintViolationException ex) {
        return exceptionMapper.constraint(ex);
    }

    @ServerExceptionMapper
    public RestResponse<ProblemDetailResponseDTO> optimisticLockException(OptimisticLockException ex) {
        return exceptionMapper.optimisticLock(ex);
    }
}


```

## Folder: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/internal/log (1 files)

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/internal/log/ThemesLogParam.java

```java

package org.tkit.onecx.theme.rs.internal.log;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;

import org.tkit.quarkus.log.cdi.LogParam;

import gen.org.tkit.onecx.theme.rs.internal.model.CreateThemeDTO;
import gen.org.tkit.onecx.theme.rs.internal.model.ThemeSearchCriteriaDTO;
import gen.org.tkit.onecx.theme.rs.internal.model.UpdateThemeDTO;

@ApplicationScoped
public class ThemesLogParam implements LogParam {

    @Override
    public List<Item> getClasses() {
        return List.of(
                item(10, CreateThemeDTO.class, x -> x.getClass().getSimpleName() + ":" + ((CreateThemeDTO) x).getName()),
                item(10, ThemeSearchCriteriaDTO.class, x -> {
                    ThemeSearchCriteriaDTO d = (ThemeSearchCriteriaDTO) x;
                    return ThemeSearchCriteriaDTO.class.getSimpleName() + "[" + d.getPageNumber() + "," + d.getPageSize() + "]";
                }),
                item(10, UpdateThemeDTO.class, x -> x.getClass().getSimpleName() + ":" + ((UpdateThemeDTO) x).getName()));
    }
}


```

## Folder: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/internal/mappers (4 files)

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/internal/mappers/ExceptionMapper.java

```java

package org.tkit.onecx.theme.rs.internal.mappers;

import java.util.List;
import java.util.Map;
import java.util.Set;

import jakarta.persistence.OptimisticLockException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Path;
import jakarta.ws.rs.core.Response;

import org.jboss.resteasy.reactive.RestResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.tkit.quarkus.jpa.exceptions.ConstraintException;
import org.tkit.quarkus.log.cdi.LogService;
import org.tkit.quarkus.rs.mappers.OffsetDateTimeMapper;

import gen.org.tkit.onecx.theme.rs.internal.model.ProblemDetailInvalidParamDTO;
import gen.org.tkit.onecx.theme.rs.internal.model.ProblemDetailParamDTO;
import gen.org.tkit.onecx.theme.rs.internal.model.ProblemDetailResponseDTO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Mapper(uses = { OffsetDateTimeMapper.class })
public abstract class ExceptionMapper {

    public RestResponse<ProblemDetailResponseDTO> constraint(ConstraintViolationException ex) {
        var dto = exception(ErrorKeys.CONSTRAINT_VIOLATIONS.name(), ex.getMessage());
        dto.setInvalidParams(createErrorValidationResponse(ex.getConstraintViolations()));
        return RestResponse.status(Response.Status.BAD_REQUEST, dto);
    }

    public RestResponse<ProblemDetailResponseDTO> exception(ConstraintException ex) {
        var dto = exception(ex.getMessageKey().name(), ex.getConstraints());
        dto.setParams(map(ex.namedParameters));
        return RestResponse.status(Response.Status.BAD_REQUEST, dto);
    }

    @LogService(log = false)
    public RestResponse<ProblemDetailResponseDTO> optimisticLock(OptimisticLockException ex) {
        var dto = exception(ErrorKeys.OPTIMISTIC_LOCK.name(), ex.getMessage());
        return RestResponse.status(Response.Status.BAD_REQUEST, dto);
    }

    @Mapping(target = "removeParamsItem", ignore = true)
    @Mapping(target = "params", ignore = true)
    @Mapping(target = "invalidParams", ignore = true)
    @Mapping(target = "removeInvalidParamsItem", ignore = true)
    public abstract ProblemDetailResponseDTO exception(String errorCode, String detail);

    public List<ProblemDetailParamDTO> map(Map<String, Object> params) {
        if (params == null) {
            return List.of();
        }
        return params.entrySet().stream().map(e -> {
            var item = new ProblemDetailParamDTO();
            item.setKey(e.getKey());
            if (e.getValue() != null) {
                item.setValue(e.getValue().toString());
            }
            return item;
        }).toList();
    }

    public abstract List<ProblemDetailInvalidParamDTO> createErrorValidationResponse(
            Set<ConstraintViolation<?>> constraintViolation);

    @Mapping(target = "name", source = "propertyPath")
    @Mapping(target = "message", source = "message")
    public abstract ProblemDetailInvalidParamDTO createError(ConstraintViolation<?> constraintViolation);

    public String mapPath(Path path) {
        return path.toString();
    }

    public enum ErrorKeys {

        OPTIMISTIC_LOCK,
        CONSTRAINT_VIOLATIONS;
    }
}


```

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/internal/mappers/IconMapper.java

```java

package org.tkit.onecx.theme.rs.internal.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.tkit.onecx.theme.domain.models.Icon;
import org.tkit.quarkus.rs.mappers.OffsetDateTimeMapper;

import gen.org.tkit.onecx.theme.rs.icon.internal.model.IconDTO;

@Mapper(uses = OffsetDateTimeMapper.class)
public interface IconMapper {
    List<IconDTO> mapList(List<Icon> icons);

    IconDTO map(Icon icon);
}


```

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/internal/mappers/ImageMapper.java

```java

package org.tkit.onecx.theme.rs.internal.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.tkit.onecx.theme.domain.models.Image;
import org.tkit.quarkus.rs.mappers.OffsetDateTimeMapper;

import gen.org.tkit.onecx.image.rs.internal.model.ImageInfoDTO;

@Mapper(uses = OffsetDateTimeMapper.class)
public interface ImageMapper {

    ImageInfoDTO map(Image image);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "controlTraceabilityManual", ignore = true)
    @Mapping(target = "modificationCount", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "creationUser", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "modificationUser", ignore = true)
    @Mapping(target = "persisted", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "operator", ignore = true)
    @Mapping(target = "refId", source = "refId")
    @Mapping(target = "refType", source = "refType")
    Image create(String refId, String refType, String mimeType, Integer length, byte[] imageData);

    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "refType", ignore = true)
    @Mapping(target = "refId", ignore = true)
    @Mapping(target = "persisted", ignore = true)
    @Mapping(target = "operator", ignore = true)
    @Mapping(target = "modificationUser", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "modificationCount", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationUser", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "controlTraceabilityManual", ignore = true)
    void update(@MappingTarget Image image, Integer length, String mimeType, byte[] imageData);
}


```

### File: onecx-theme-svc/src/main/java/org/tkit/onecx/theme/rs/internal/mappers/ThemeMapper.java

```java

package org.tkit.onecx.theme.rs.internal.mappers;

import java.util.List;
import java.util.stream.Stream;

import jakarta.inject.Inject;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.tkit.onecx.theme.domain.criteria.ThemeSearchCriteria;
import org.tkit.onecx.theme.domain.models.Theme;
import org.tkit.onecx.theme.domain.models.ThemeInfo;
import org.tkit.onecx.theme.domain.models.ThemeOverride;
import org.tkit.quarkus.jpa.daos.PageResult;
import org.tkit.quarkus.rs.mappers.OffsetDateTimeMapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gen.org.tkit.onecx.theme.rs.internal.model.*;

@Mapper(uses = { OffsetDateTimeMapper.class })
public abstract class ThemeMapper {

    @Inject
    ObjectMapper mapper;

    public abstract ThemeSearchCriteria map(ThemeSearchCriteriaDTO dto);

    public ThemeInfoListDTO mapInfoList(Stream<ThemeInfo> data) {
        ThemeInfoListDTO result = new ThemeInfoListDTO();
        result.setThemes(mapInfo(data));
        return result;
    }

    public abstract List<ThemeInfoDTO> mapInfo(Stream<ThemeInfo> page);

    @Mapping(target = "removeStreamItem", ignore = true)
    public abstract ThemePageResultDTO mapPage(PageResult<Theme> page);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "controlTraceabilityManual", ignore = true)
    @Mapping(target = "modificationCount", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "creationUser", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "modificationUser", ignore = true)
    @Mapping(target = "persisted", ignore = true)
    @Mapping(target = "properties", qualifiedByName = "o2s")
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "operator", ignore = true)
    public abstract Theme create(CreateThemeDTO object);

    public abstract List<ThemeDTO> map(Stream<Theme> entity);

    @Mapping(target = "removeOverridesItem", ignore = true)
    @Mapping(target = "properties", qualifiedByName = "s2o")
    @Mapping(target = "overrides", ignore = true)
    public abstract ThemeDTO map(Theme theme);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "creationUser", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "modificationUser", ignore = true)
    @Mapping(target = "controlTraceabilityManual", ignore = true)
    @Mapping(target = "persisted", ignore = true)
    @Mapping(target = "properties", qualifiedByName = "o2s")
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "operator", ignore = true)
    public abstract void update(UpdateThemeDTO themeDTO, @MappingTarget Theme entity);

    @Mapping(target = "themeId", ignore = true)
    @Mapping(target = "id", ignore = true)
    public abstract ThemeOverride map(ThemeOverrideDTO dto);

    public abstract ThemeOverrideDTO map(ThemeOverride override);

    @Named("o2s")
    public String mapToString(Object properties) {

        if (properties == null) {
            return null;
        }

        try {
            return mapper.writeValueAsString(properties);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    @Named("s2o")
    public Object stringToObject(String jsonVar) {

        if (jsonVar == null || jsonVar.isEmpty()) {
            return null;
        }

        try {
            return mapper.readTree(jsonVar);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

}


```

## Folder: onecx-theme-svc/src/main/openapi (8 files)

### File: onecx-theme-svc/src/main/openapi/onecx-icon-internal.yaml

```yaml

---
openapi: 3.0.3
info:
 title: OneCX-theme internal icon service
 description: This API provides endpoints to manage icons of themes
 version: 1.0.0
servers:
 - url: "http://onecx-theme-svc:8080"
tags:
 - name: iconsInternal
   description: Manage Icons
paths:
 /internal/icons/{refId}:
  post:
   security:
    - oauth2: [ ocx-th:all, ocx-th:read ]
   tags:
    - iconsInternal
   description: Retrieve icons by list of names and refId
   parameters:
    - name: refId
      in: path
      required: true
      schema:
       type: string
   operationId: findIconsByNamesAndRefId
   requestBody:
    required: true
    content:
     application/json:
      schema:
        $ref: '#/components/schemas/IconCriteria'
   responses:
    "200":
     description: Icons retrieved successfully
     content:
      application/json:
       schema:
        $ref: '#/components/schemas/IconListResponse'
    "400":
     description: Bad Request
 /internal/icons/{refId}/upload:
  post:
   security:
    - oauth2: [ ocx-th:all, ocx-th:write ]
   tags:
    - iconsInternal
   description: Upload an icon set by its reference id
   parameters:
    - name: refId
      in: path
      required: true
      schema:
       type: string
   operationId: uploadIconSet
   requestBody:
    required: true
    content:
     application/json:
      schema:
       type: string
       format: binary
   responses:
    "201":
     description: Icon uploaded successfully
    "400":
     description: Bad Request
components:
 securitySchemes:
  oauth2:
   type: oauth2
   flows:
    clientCredentials:
     tokenUrl: https://oauth.simple.api/token
     scopes:
      ocx-th:all: Grants access to all operations
      ocx-th:read: Grants read access
      ocx-th:write: Grants write access
 schemas:
  IconCriteria:
   type: object
   required:
    - names
   properties:
    names:
     type: array
     minItems: 1
     items:
      type: string
  IconListResponse:
   type: object
   properties:
    icons:
     type: array
     items:
      $ref: '#/components/schemas/Icon'
  Icon:
   type: object
   properties:
    name:
     type: string
    type:
     type: string
    body:
     type: string
    parent:
     type: string
  ProblemDetailResponse:
   type: object
   properties:
    errorCode:
     type: string
    detail:
     type: string
    params:
     type: array
     items:
      $ref: '#/components/schemas/ProblemDetailParam'
    invalidParams:
     type: array
     items:
      $ref: '#/components/schemas/ProblemDetailInvalidParam'
  ProblemDetailParam:
   type: object
   properties:
    key:
     type: string
    value:
     type: string
  ProblemDetailInvalidParam:
   type: object
   properties:
    name:
     type: string
    message:
     type: string

```

### File: onecx-theme-svc/src/main/openapi/onecx-icon-v1.yaml

```yaml

---
openapi: 3.0.3
info:
 title: OneCX-theme internal icon service
 description: This API provides endpoints to manage icons of themes
 version: 1.0.0
servers:
 - url: "http://onecx-theme-svc:8080"
tags:
 - name: icons
   description: Manage Icons
paths:
 /v1/icons/{refId}:
  post:
   security:
    - oauth2: [ ocx-th:read ]
   tags:
    - icons
   description: Retrieve icons by list of names and refId
   parameters:
    - name: refId
      in: path
      required: true
      schema:
       type: string
   operationId: findIconsByNamesAndRefId
   requestBody:
    required: true
    content:
     application/json:
      schema:
       $ref: '#/components/schemas/IconCriteria'
   responses:
    "200":
     description: Icons retrieved successfully
     content:
      application/json:
       schema:
        $ref: '#/components/schemas/IconListResponse'
    "400":
     description: Bad Request
components:
 securitySchemes:
  oauth2:
   type: oauth2
   flows:
    clientCredentials:
     tokenUrl: https://oauth.simple.api/token
     scopes:
      ocx-th:read: Grants read access
 schemas:
  IconCriteria:
   type: object
   required:
    - names
   properties:
    names:
     minItems: 1
     type: array
     items:
      type: string
  IconListResponse:
   type: object
   properties:
    icons:
     type: array
     items:
      $ref: '#/components/schemas/Icon'
  Icon:
   type: object
   properties:
    name:
     type: string
    type:
     type: string
    body:
     type: string
    parent:
     type: string
  ProblemDetailResponse:
   type: object
   properties:
    errorCode:
     type: string
    detail:
     type: string
    params:
     type: array
     items:
      $ref: '#/components/schemas/ProblemDetailParam'
    invalidParams:
     type: array
     items:
      $ref: '#/components/schemas/ProblemDetailInvalidParam'
  ProblemDetailParam:
   type: object
   properties:
    key:
     type: string
    value:
     type: string
  ProblemDetailInvalidParam:
   type: object
   properties:
    name:
     type: string
    message:
     type: string

```

### File: onecx-theme-svc/src/main/openapi/onecx-image-internal.yaml

```yaml

---
openapi: 3.0.3
info:
  title: Onecx-theme internal image service
  description: This API provides endpoints to manage images of themes
  version: 1.0.0
servers:
  - url: "http://onecx-theme-svc:8080"
tags:
  - name: imagesInternal
    description: Manage Images
paths:
  /internal/images/{refId}/availableTypes:
    get:
      security:
        - oauth2: [ ocx-th:all, ocx-th:read ]
      tags:
        - imagesInternal
      description: Get available image types
      operationId: getAvailableImageTypes
      parameters:
        - name: refId
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Available image types retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AvailableImageTypes'
  /internal/images/{refId}/{refType}:
    get:
      security:
        - oauth2: [ ocx-th:all, ocx-th:read ]
      tags:
        - imagesInternal
      description: Get an image by its reference id and type
      operationId: getImage
      parameters:
        - name: refId
          in: path
          required: true
          schema:
            type: string
        - name: refType
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Image retrieved successfully
          content:
            image/*:
              schema:
                minimum: 1
                maximum: 110000
                type: string
                format: binary
        "400":
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
    delete:
      security:
        - oauth2: [ ocx-th:all, ocx-th:delete ]
      tags:
        - imagesInternal
      description: Delete an image by its reference id and type
      operationId: deleteImage
      parameters:
        - name: refId
          in: path
          required: true
          schema:
            type: string
        - name: refType
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Image deleted successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ImageInfo'
        "400":
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
    post:
      security:
        - oauth2: [ ocx-th:all, ocx-th:write ]
      tags:
        - imagesInternal
      description: Upload an images by its reference id and type
      parameters:
        - in: header
          name: Content-Length
          required: true
          schema:
            minimum: 1
            maximum: 110000
            type: integer
        - name: refId
          in: path
          required: true
          schema:
            type: string
        - name: refType
          in: path
          required: true
          schema:
            type: string
        - name: mimeType
          in: header
          required: true
          schema:
            $ref: "#/components/schemas/MimeType"
      operationId: uploadImage
      requestBody:
        required: true
        content:
          image/*:
            schema:
              minimum: 1
              maximum: 110000
              type: string
              format: binary
      responses:
        "201":
          description: Image uploaded successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ImageInfo'
        "400":
          description: Bad Request
  /internal/images/{refId}:
    delete:
      security:
        - oauth2: [ ocx-th:all, ocx-th:delete ]
      tags:
        - imagesInternal
      description: Delete an image by its reference id
      operationId: deleteImagesById
      parameters:
        - name: refId
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Image deleted successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ImageInfo'
        "400":
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
components:
  securitySchemes:
    oauth2:
      type: oauth2
      flows:
        clientCredentials:
          tokenUrl: https://oauth.simple.api/token
          scopes:
            ocx-th:all: Grants access to all operations
            ocx-th:read: Grants read access
            ocx-th:write: Grants write access
            ocx-th:delete: Grants access to delete operations
  schemas:
    MimeType:
      type: string
      enum: [ "image/x-icon", "image/svg+xml", "image/png", "image/jpg", "image/jpeg" ]
    RefType:
      type: string
      enum: [ logo, logo-small, favicon ]
    ImageInfo:
      type: object
      properties:
        id:
          type: string
    AvailableImageTypes:
      type: object
      properties:
        types:
          type: array
          items:
            type: string
    ProblemDetailResponse:
      type: object
      properties:
        errorCode:
          type: string
        detail:
          type: string
        params:
          type: array
          items:
            $ref: '#/components/schemas/ProblemDetailParam'
        invalidParams:
          type: array
          items:
            $ref: '#/components/schemas/ProblemDetailInvalidParam'
    ProblemDetailParam:
      type: object
      properties:
        key:
          type: string
        value:
          type: string
    ProblemDetailInvalidParam:
      type: object
      properties:
        name:
          type: string
        message:
          type: string

```

### File: onecx-theme-svc/src/main/openapi/onecx-theme-admin-v1.yaml

```yaml

---
openapi: 3.0.3
info:
 title: onecx-theme admin v1 service
 description: This API provides endpoints to manage Themes as an Admin
 version: 1.0.0
servers:
 - url: "http://onecx-theme-svc:8080"
tags:
 - name: themesAdmin
   description: Managing Themes as an Admin
paths:
 /admin/v1/themes:
  post:
   security:
    - oauth2: [ ocx-th:admin-write ]
   tags:
    - themesAdmin
   description: Create a new theme
   operationId: createNewTheme
   requestBody:
    required: true
    content:
     application/json:
      schema:
       $ref: '#/components/schemas/CreateThemeRequest'
   responses:
    "201":
     description: Theme created successfully
     content:
      application/json:
       schema:
        $ref: '#/components/schemas/CreateThemeResponse'
    "400":
     description: Bad request
     content:
      application/json:
       schema:
        $ref: '#/components/schemas/ProblemDetailResponse'
 /admin/v1/themes/{id}:
  get:
   security:
    - oauth2: [ ocx-th:admin-read ]
   tags:
    - themesAdmin
   description: Get a theme by its id
   operationId: getThemeById
   parameters:
    - name: id
      in: path
      required: true
      schema:
       type: string
   responses:
    "200":
     description: Theme retrieved successfully
     content:
      application/json:
       schema:
        $ref: '#/components/schemas/Theme'
    "404":
     description: Theme not found
  put:
   security:
    - oauth2: [ ocx-th:admin-write ]
   tags:
    - themesAdmin
   description: Update a theme by its id
   operationId: updateTheme
   parameters:
    - name: id
      in: path
      required: true
      schema:
       type: string
   requestBody:
    required: true
    content:
     application/json:
      schema:
       $ref: '#/components/schemas/UpdateThemeRequest'
   responses:
    "204":
     description: Theme updated successfully
    "400":
     description: Bad request
     content:
      application/json:
       schema:
        $ref: '#/components/schemas/ProblemDetailResponse'
    "404":
     description: Theme not found
  delete:
   security:
    - oauth2: [ ocx-th:admin-delete ]
   tags:
    - themesAdmin
   description: Delete a theme by its id
   operationId: deleteTheme
   parameters:
    - name: id
      in: path
      required: true
      schema:
       type: string
   responses:
    "204":
     description: Theme deleted successfully
 /admin/v1/themes/search:
  post:
   security:
    - oauth2: [ ocx-th:admin-read ]
   tags:
    - themesAdmin
   description: Search for themes by search criteria
   operationId: searchThemes
   requestBody:
    required: true
    content:
     application/json:
      schema:
       $ref: '#/components/schemas/ThemeSearchCriteria'
   responses:
    "200":
     description: Theme search results retrieved successfully
     content:
      application/json:
       schema:
        type: array
        items:
         $ref: '#/components/schemas/ThemePageResult'
components:
 securitySchemes:
  oauth2:
   type: oauth2
   flows:
    clientCredentials:
     tokenUrl: https://oauth.simple.api/token
     scopes:
      ocx-th:admin-read: Grants read access
      ocx-th:admin-write: Grants write access
      ocx-th:admin-delete: Grants access to delete operations
 schemas:
  ThemeSearchCriteria:
   type: object
   properties:
    name:
     type: string
    pageNumber:
     format: int32
     description: The number of page.
     default: 0
     type: integer
    pageSize:
     format: int32
     description: The size of page
     default: 100
     maximum: 1000
     type: integer
  ThemePageResult:
   type: object
   properties:
    totalElements:
     format: int64
     description: The total elements in the resource.
     type: integer
    number:
     format: int32
     type: integer
    size:
     format: int32
     type: integer
    totalPages:
     format: int64
     type: integer
    stream:
     type: array
     items:
      $ref: '#/components/schemas/Theme'
  CreateThemeRequest:
   type: object
   required:
    - resource
   properties:
    resource:
     $ref: '#/components/schemas/CreateTheme'
  CreateThemeResponse:
   type: object
   required:
    - resource
   properties:
    resource:
     $ref: '#/components/schemas/Theme'
  UpdateThemeRequest:
   type: object
   required:
    - resource
   properties:
    resource:
     $ref: '#/components/schemas/UpdateTheme'
  Theme:
   required:
    - name
    - displayName
   type: object
   properties:
    modificationCount:
     format: int32
     type: integer
    creationDate:
     $ref: '#/components/schemas/OffsetDateTime'
    creationUser:
     type: string
    modificationDate:
     $ref: '#/components/schemas/OffsetDateTime'
    modificationUser:
     type: string
    id:
     type: string
    name:
     minLength: 2
     type: string
    displayName:
     minLength: 2
     type: string
    cssFile:
     type: string
    description:
     type: string
    assetsUrl:
     type: string
    logoUrl:
     type: string
    smallLogoUrl:
     type: string
    faviconUrl:
     type: string
    previewImageUrl:
     type: string
    assetsUpdateDate:
     type: string
    properties:
     type: object
    overrides:
     type: array
     items:
      $ref: '#/components/schemas/ThemeOverride'
    operator:
     type: boolean
     default: false
    mandatory:
     type: boolean
     default: false
  OffsetDateTime:
   format: date-time
   type: string
   example: 2022-03-10T12:15:50-04:00
  ProblemDetailResponse:
   type: object
   properties:
    errorCode:
     type: string
    detail:
     type: string
    params:
     type: array
     items:
      $ref: '#/components/schemas/ProblemDetailParam'
    invalidParams:
     type: array
     items:
      $ref: '#/components/schemas/ProblemDetailInvalidParam'
  ProblemDetailParam:
   type: object
   properties:
    key:
     type: string
    value:
     type: string
  ProblemDetailInvalidParam:
   type: object
   properties:
    name:
     type: string
    message:
     type: string
  CreateTheme:
   required:
    - name
    - displayName
   type: object
   properties:
    name:
     minLength: 2
     type: string
    displayName:
     minLength: 2
     type: string
    cssFile:
     type: string
    description:
     type: string
    assetsUrl:
     type: string
    logoUrl:
     type: string
    smallLogoUrl:
     type: string
    faviconUrl:
     type: string
    previewImageUrl:
     type: string
    assetsUpdateDate:
     type: string
    properties:
     type: object
    overrides:
     type: array
     items:
      $ref: '#/components/schemas/ThemeOverride'
    mandatory:
     type: boolean
     default: false
  UpdateTheme:
   required:
    - name
    - displayName
    - modificationCount
   type: object
   properties:
    modificationCount:
     format: int32
     type: integer
    name:
     minLength: 2
     type: string
    displayName:
     minLength: 2
     type: string
    cssFile:
     type: string
    description:
     type: string
    assetsUrl:
     type: string
    logoUrl:
     type: string
    smallLogoUrl:
     type: string
    faviconUrl:
     type: string
    previewImageUrl:
     type: string
    assetsUpdateDate:
     type: string
    properties:
     type: object
    overrides:
     type: array
     items:
      $ref: '#/components/schemas/ThemeOverride'
    mandatory:
     type: boolean
  ThemeOverride:
   type: object
   properties:
    type:
     $ref: '#/components/schemas/OverrideType'
    value:
     type: string
  OverrideType:
   type: string
   enum:
    - PRIMENG
    - CSS

```

### File: onecx-theme-svc/src/main/openapi/onecx-theme-di-template.yaml

```yaml

---
openapi: 3.0.3
info:
  title: onecx-theme internal template import service
  description: This API provides endpoints for themes import from file during the start of the application
  version: 1.0.0
servers:
  - url: "http://localhost"
paths:
  /import/theme:
    post:
      security:
        - oauth2: [ ocx-th:write ]
      operationId: importTheme
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TemplateImport'
      responses:
        200:
          description: Template imported successfully
components:
  securitySchemes:
    oauth2:
      type: oauth2
      flows:
        clientCredentials:
          tokenUrl: https://oauth.simple.api/token
          scopes:
            ocx-th:write: Grants write access
  schemas:
    TemplateImport:
      type: object
      properties:
        themes:
          $ref: '#/components/schemas/TemplateThemes'
    TemplateThemes:
      type: object
      nullable: false
      additionalProperties:
        $ref: '#/components/schemas/TemplateTheme'
    TemplateTheme:
      type: object
      required:
        - tenantId
      properties:
        cssFile:
          type: string
        description:
          type: string
        assetsUrl:
          type: string
        logoUrl:
          type: string
        smallLogoUrl:
          type: string
        faviconUrl:
          type: string
        images:
          $ref: '#/components/schemas/TemplateImages'
        previewImageUrl:
          type: string
        assetsUpdateDate:
          type: string
        properties:
          type: object
        overrides:
          type: array
          items:
            $ref: '#/components/schemas/TemplateThemeOverride'
        mandatory:
          type: boolean
          default: false
    TemplateImages:
      type: object
      nullable: false
      additionalProperties:
        $ref: '#/components/schemas/TemplateImage'
    TemplateImage:
      type: object
      properties:
        imageData:
          type: string
          format: byte
        mimeType:
          type: string
    TemplateThemeOverride:
      type: object
      properties:
        type:
          $ref: '#/components/schemas/TemplateOverrideType'
        value:
          type: string
    TemplateOverrideType:
      type: string
      enum:
        - PRIMENG
        - CSS


```

### File: onecx-theme-svc/src/main/openapi/onecx-theme-exim-v1.yaml

```yaml

---
openapi: 3.0.3
info:
  title: onecx-theme export and import service v1
  description: This API provides endpoints for exporting and importing themes
  version: 1.0.0
servers:
  - url: "http://onecx-theme-svc:8080"
tags:
  - name: themesExportImport
    description: Exporting and importing Themes
paths:
  /exim/v1/themes/export:
    post:
      security:
        - oauth2: [ ocx-th:all, ocx-th:read ]
      tags:
        - themesExportImport
      description: Export one or multiple themes
      operationId: exportThemes
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExportThemeRequest'
      responses:
        "200":
          description: Theme exported successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThemeSnapshot'
        "404":
          description: Themes not found
  /exim/v1/themes/import:
    post:
      security:
        - oauth2: [ ocx-th:all, ocx-th:write ]
      tags:
        - themesExportImport
      description: Import one or multiple themes
      operationId: importThemes
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ThemeSnapshot'
      responses:
        "200":
          description: Themes imported successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ImportThemeResponse'
        "400":
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EximProblemDetailResponse'
  /exim/v1/themes/operator:
    post:
      security:
        - oauth2: [ ocx-th:all, ocx-th:write ]
      tags:
        - themesExportImport
      description: Import themes by the onecx operator only
      operationId: operatorImportThemes
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ThemeSnapshot'
      responses:
        "200":
          description: Theme imported successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ImportThemeResponse'
        "400":
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EximProblemDetailResponse'
components:
  securitySchemes:
    oauth2:
      type: oauth2
      flows:
        clientCredentials:
          tokenUrl: https://oauth.simple.api/token
          scopes:
            ocx-th:all: Grants access to all operations
            ocx-th:read: Grants read access
            ocx-th:write: Grants write access
  schemas:
    ExportThemeRequest:
      type: object
      properties:
        names:
          type: array
          uniqueItems: true
          items:
            type: string
    ThemeSnapshot:
      type: object
      properties:
        id:
          type: string
          minLength: 10
          description: ID of the request
        created:
          $ref: '#/components/schemas/OffsetDateTime'
        themes:
          type: object
          nullable: false
          additionalProperties:
            $ref: '#/components/schemas/EximTheme'
    ImportThemeResponse:
      type: object
      properties:
        id:
          type: string
          minLength: 10
          description: ID of the request
        themes:
          additionalProperties:
            $ref: '#/components/schemas/ImportThemeResponseStatus'
    ImportThemeResponseStatus:
      type: string
      enum:
        - UPDATE
        - CREATED
        - SKIP
    EximTheme:
      type: object
      properties:
        displayName:
          type: string
        cssFile:
          type: string
        description:
          type: string
        assetsUrl:
          type: string
        logoUrl:
          type: string
        smallLogoUrl:
          type: string
        faviconUrl:
          type: string
        previewImageUrl:
          type: string
        assetsUpdateDate:
          type: string
        properties:
          type: object
        overrides:
          type: array
          items:
            $ref: '#/components/schemas/EximThemeOverride'
        images:
          $ref: '#/components/schemas/Images'
        mandatory:
          type: boolean
          default: false
    EximProblemDetailResponse:
      type: object
      properties:
        errorCode:
          type: string
        detail:
          type: string
        params:
          type: array
          items:
            $ref: '#/components/schemas/EximProblemDetailParam'
        invalidParams:
          type: array
          items:
            $ref: '#/components/schemas/EximProblemDetailInvalidParam'
    EximProblemDetailParam:
      type: object
      properties:
        key:
          type: string
        value:
          type: string
    EximProblemDetailInvalidParam:
      type: object
      properties:
        name:
          type: string
        message:
          type: string
    OffsetDateTime:
      format: date-time
      type: string
      example: 2022-03-10T12:15:50-04:00
    Images:
      type: object
      nullable: false
      additionalProperties:
        $ref: '#/components/schemas/Image'
    Image:
      type: object
      properties:
        imageData:
          type: string
          format: byte
        mimeType:
          type: string
    EximThemeOverride:
      type: object
      properties:
        type:
          $ref: '#/components/schemas/EximOverrideType'
        value:
          type: string
    EximOverrideType:
      type: string
      enum:
        - PRIMENG
        - CSS

```

### File: onecx-theme-svc/src/main/openapi/onecx-theme-internal.yaml

```yaml

---
openapi: 3.0.3
info:
  title: onecx-theme internal service
  description: This API provides endpoints to manage Themes
  version: 1.0.0
servers:
  - url: "http://onecx-theme-svc:8080"
tags:
  - name: themesInternal
    description: Managing Themes
paths:
  /internal/themes:
    post:
      security:
        - oauth2: [ ocx-th:all, ocx-th:write ]
      tags:
        - themesInternal
      description: Create a new theme
      operationId: createNewTheme
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateTheme'
      responses:
        "201":
          description: Theme created successfully
          headers:
            Location:
              required: true
              schema:
                type: string
                format: url
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Theme'
        "400":
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
  /internal/themes/{id}:
    get:
      security:
        - oauth2: [ ocx-th:all, ocx-th:read ]
      tags:
        - themesInternal
      description: Get a theme by its id
      operationId: getThemeById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Theme retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Theme'
        "404":
          description: Theme not found
    put:
      security:
        - oauth2: [ ocx-th:all, ocx-th:write ]
      tags:
        - themesInternal
      description: Update a theme by its id
      operationId: updateTheme
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateTheme'
      responses:
        "204":
          description: Theme updated successfully
        "400":
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
        "404":
          description: Theme not found
    delete:
      security:
        - oauth2: [ ocx-th:all, ocx-th:delete ]
      tags:
        - themesInternal
      description: Delete a theme by its id
      operationId: deleteTheme
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "204":
          description: Theme deleted successfully
  /internal/themes/info:
    get:
      security:
        - oauth2: [ ocx-th:all, ocx-th:read ]
      tags:
        - themesInternal
      description: Get a list of all themes
      operationId: getThemeInfoList
      responses:
        "200":
          description: Themes retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThemeInfoList'
        "404":
          description: Themes not found
  /internal/themes/search:
    post:
      security:
        - oauth2: [ ocx-th:all, ocx-th:read ]
      tags:
        - themesInternal
      description: Search for themes by search criteria
      operationId: searchThemes
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ThemeSearchCriteria'
      responses:
        "200":
          description: Theme search results retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/ThemePageResult'
  /internal/themes/name/{name}:
    get:
      security:
        - oauth2: [ ocx-th:all, ocx-th:read ]
      tags:
        - themesInternal
      description: Load a single theme by its name
      operationId: getThemeByThemeDefinitionName
      parameters:
        - name: name
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Theme retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Theme'
        "404":
          description: Theme not found
components:
  securitySchemes:
    oauth2:
      type: oauth2
      flows:
        clientCredentials:
          tokenUrl: https://oauth.simple.api/token
          scopes:
            ocx-th:all: Grants access to all operations
            ocx-th:read: Grants read access
            ocx-th:write: Grants write access
            ocx-th:delete: Grants access to delete operations
  schemas:
    ThemeSearchCriteria:
      type: object
      properties:
        name:
          type: string
        pageNumber:
          format: int32
          description: The number of page.
          default: 0
          type: integer
        pageSize:
          format: int32
          description: The size of page
          default: 100
          maximum: 1000
          type: integer
    ThemeInfoList:
      type: object
      properties:
        themes:
          type: array
          items:
            $ref: '#/components/schemas/ThemeInfo'
    ThemeInfo:
      type: object
      properties:
        name:
          minLength: 2
          type: string
        description:
          type: string
    ThemePageResult:
      type: object
      properties:
        totalElements:
          format: int64
          description: The total elements in the resource.
          type: integer
        number:
          format: int32
          type: integer
        size:
          format: int32
          type: integer
        totalPages:
          format: int64
          type: integer
        stream:
          type: array
          items:
            $ref: '#/components/schemas/Theme'
    Theme:
      required:
        - name
        - displayName
      type: object
      properties:
        modificationCount:
          format: int32
          type: integer
        creationDate:
          $ref: '#/components/schemas/OffsetDateTime'
        creationUser:
          type: string
        modificationDate:
          $ref: '#/components/schemas/OffsetDateTime'
        modificationUser:
          type: string
        id:
          type: string
        name:
          minLength: 2
          type: string
        displayName:
          minLength: 2
          type: string
        cssFile:
          type: string
        description:
          type: string
        assetsUrl:
          type: string
        logoUrl:
          type: string
        smallLogoUrl:
          type: string
        faviconUrl:
          type: string
        previewImageUrl:
          type: string
        assetsUpdateDate:
          type: string
        properties:
          type: object
        overrides:
          type: array
          items:
            $ref: '#/components/schemas/ThemeOverride'
        operator:
          type: boolean
          default: false
        mandatory:
          type: boolean
          default: false
    OffsetDateTime:
      format: date-time
      type: string
      example: 2022-03-10T12:15:50-04:00
    ProblemDetailResponse:
      type: object
      properties:
        errorCode:
          type: string
        detail:
          type: string
        params:
          type: array
          items:
            $ref: '#/components/schemas/ProblemDetailParam'
        invalidParams:
          type: array
          items:
            $ref: '#/components/schemas/ProblemDetailInvalidParam'
    ProblemDetailParam:
      type: object
      properties:
        key:
          type: string
        value:
          type: string
    ProblemDetailInvalidParam:
      type: object
      properties:
        name:
          type: string
        message:
          type: string
    CreateTheme:
      required:
        - name
        - displayName
      type: object
      properties:
        name:
          minLength: 2
          type: string
        displayName:
          minLength: 2
          type: string
        cssFile:
          type: string
        description:
          type: string
        assetsUrl:
          type: string
        logoUrl:
          type: string
        smallLogoUrl:
          type: string
        faviconUrl:
          type: string
        previewImageUrl:
          type: string
        assetsUpdateDate:
          type: string
        properties:
          type: object
        overrides:
          type: array
          items:
            $ref: '#/components/schemas/ThemeOverride'
        mandatory:
          type: boolean
          default: false
    UpdateTheme:
      required:
        - name
        - displayName
        - modificationCount
      type: object
      properties:
        modificationCount:
          format: int32
          type: integer
        name:
          minLength: 2
          type: string
        displayName:
          minLength: 2
          type: string
        cssFile:
          type: string
        description:
          type: string
        assetsUrl:
          type: string
        logoUrl:
          type: string
        smallLogoUrl:
          type: string
        faviconUrl:
          type: string
        previewImageUrl:
          type: string
        assetsUpdateDate:
          type: string
        properties:
          type: object
        overrides:
          type: array
          items:
            $ref: '#/components/schemas/ThemeOverride'
        mandatory:
          type: boolean
    ThemeOverride:
      type: object
      properties:
        type:
          $ref: '#/components/schemas/OverrideType'
        value:
          type: string
    OverrideType:
      type: string
      enum:
        - PRIMENG
        - CSS

```

### File: onecx-theme-svc/src/main/openapi/onecx-theme-v1.yaml

```yaml

---
openapi: 3.0.3
info:
  title: onecx-theme external service V1
  description: This API provides endpoints to retrieve Themes and Images
  version: 1.0.0
servers:
  - url: "http://onecx-theme-svc:8080"
tags:
  - name: themes
    description: Retrieve Themes and Images
paths:
  /v1/themes:
    get:
      security:
        - oauth2: [ ocx-th:read ]
      tags:
        - themes
      description: Get a list of all themes
      operationId: getThemesInfo
      responses:
        "200":
          description: Themes retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThemeInfoList'
        "404":
          description: Themes not found
  /v1/themes/{name}:
    get:
      security:
        - oauth2: [ ocx-th:read ]
      tags:
        - themes
      description: Get a single theme by its name
      operationId: getThemeByName
      parameters:
        - name: name
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Theme retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Theme'
        "404":
          description: Theme not found
  /v1/themes/{name}/favicon:
    get:
      security:
        - oauth2: [ ocx-th:read ]
      tags:
        - themes
      description: Get the favicon of a theme by its name
      operationId: getThemeFaviconByName
      parameters:
        - name: name
          in: path
          required: true
          schema:
            type: string
      responses:
        200:
          description: Favicon retrieved successfully
          content:
            image/*:
              schema:
                minimum: 1
                maximum: 110000
                type: string
                format: binary
        404:
          description: Favicon not found
  /v1/themes/{name}/logo:
    get:
      security:
        - oauth2: [ ocx-th:read ]
      tags:
        - themes
      description: Get a logo of a theme by its name
      operationId: getThemeLogoByName
      parameters:
        - name: name
          in: path
          required: true
          schema:
            type: string
        - name: small
          in: query
          required: false
          schema:
            type: boolean
            default: false
      responses:
        200:
          description: Logo retrieved successfully
          content:
            image/*:
              schema:
                minimum: 1
                maximum: 110000
                type: string
                format: binary
        404:
          description: Logo not found
  /v1/themes/{name}/images/{refType}:
    get:
      security:
        - oauth2: [ ocx-th:read ]
      tags:
        - themes
      description: Get an image of a theme by its name and reference type
      operationId: getThemeImageByNameAndRefType
      parameters:
        - name: name
          in: path
          required: true
          schema:
            type: string
        - name: refType
          in: path
          required: true
          schema:
            type: string
      responses:
        200:
          description: Image retrieved successfully
          content:
            image/*:
              schema:
                minimum: 1
                maximum: 110000
                type: string
                format: binary
        404:
          description: Image not found
  /v1/themes/{name}/images/availableTypes:
    get:
      security:
        - oauth2: [ ocx-th:read ]
      tags:
        - themes
      description: Get available image types
      operationId: getAvailableImageTypes
      parameters:
        - name: name
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Available image types retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AvailableImageTypes'
components:
  securitySchemes:
    oauth2:
      type: oauth2
      flows:
        clientCredentials:
          tokenUrl: https://oauth.simple.api/token
          scopes:
            ocx-th:read: Grants read access
  schemas:
    RefType:
      type: string
      enum: [ logo, logo-small, favicon ]
    AvailableImageTypes:
      type: object
      properties:
        types:
          type: array
          items:
            type: string
    ThemeInfoList:
      type: object
      properties:
        themes:
          type: array
          items:
            $ref: '#/components/schemas/ThemeInfo'
    ThemeInfo:
      type: object
      properties:
        name:
          minLength: 2
          type: string
        description:
          type: string
    Theme:
      required:
        - name
      type: object
      properties:
        displayName:
          type: string
        name:
          minLength: 2
          type: string
        cssFile:
          type: string
        description:
          type: string
        assetsUrl:
          type: string
        logoUrl:
          type: string
        smallLogoUrl:
          type: string
        faviconUrl:
          type: string
        previewImageUrl:
          type: string
        assetsUpdateDate:
          type: string
        properties:
          type: object
        overrides:
          type: array
          items:
            $ref: '#/components/schemas/ThemeOverride'
    ThemeOverride:
      type: object
      properties:
        type:
          $ref: '#/components/schemas/OverrideType'
        value:
          type: string
    OverrideType:
      type: string
      enum:
        - PRIMENG
        - CSS

```

## Folder: onecx-theme-svc/src/main/resources (1 files)

### File: onecx-theme-svc/src/main/resources/application.properties

```properties

# DEFAULT
quarkus.datasource.db-kind=postgresql
quarkus.datasource.jdbc.max-size=30
quarkus.datasource.jdbc.min-size=10
quarkus.datasource.metrics.enabled=true

quarkus.http.auth.permission.health.paths=/q/*
quarkus.http.auth.permission.health.policy=permit
quarkus.http.auth.permission.default.paths=/*
quarkus.http.auth.permission.default.policy=authenticated

quarkus.native.resources.includes=import/template.json
quarkus.hibernate-orm.database.generation=validate
quarkus.hibernate-orm.multitenant=DISCRIMINATOR
quarkus.hibernate-orm.jdbc.timezone=UTC
quarkus.hibernate-orm.metrics.enabled=true

quarkus.liquibase.migrate-at-start=true
quarkus.liquibase.validate-on-migrate=true

tkit.dataimport.enabled=false
tkit.dataimport.configurations.template.file=import/template.json
tkit.dataimport.configurations.template.metadata.tenants=default
tkit.dataimport.configurations.template.class-path=true
tkit.dataimport.configurations.template.enabled=false
tkit.dataimport.configurations.template.stop-at-error=true

# enable or disable multi-tenancy support
tkit.rs.context.tenant-id.enabled=true

# PROD
%prod.quarkus.datasource.jdbc.url=${DB_URL:jdbc:postgresql://postgresdb:5432/onecx-theme?sslmode=disable}
%prod.quarkus.datasource.username=${DB_USER:onecx-theme}
%prod.quarkus.datasource.password=${DB_PWD:onecx-theme}
# OIDC
%prod.quarkus.oidc-client.client-id=${quarkus.application.name}

# DEV
%dev.tkit.rs.context.tenant-id.enabled=true
%dev.tkit.rs.context.tenant-id.mock.enabled=true
%dev.tkit.rs.context.tenant-id.mock.default-tenant=test
%dev.tkit.rs.context.tenant-id.mock.data.org1=tenant100
# TEST
%test.tkit.dataimport.enabled=true
%test.tkit.dataimport.configurations.template.enabled=true
%test.tkit.dataimport.configurations.template.file=./src/test/resources/import/theme-import.json
%test.tkit.dataimport.configurations.template.metadata.tenants=default
%test.tkit.dataimport.configurations.template.class-path=false
%test.quarkus.oidc-client.client-id=${quarkus.oidc.client-id}
%test.tkit.rs.context.tenant-id.enabled=true
%test.tkit.rs.context.tenant-id.mock.enabled=true
%test.tkit.rs.context.tenant-id.mock.default-tenant=default
%test.tkit.rs.context.tenant-id.mock.claim-org-id=orgId
%test.tkit.rs.context.tenant-id.mock.data.org1=tenant-100
%test.tkit.rs.context.tenant-id.mock.data.org2=tenant-200

# TEST-IT
quarkus.test.integration-test-profile=test
quarkus.test.enable-callbacks-for-integration-tests=true

# PIPE CONFIG


```

## Folder: onecx-theme-svc/src/main/resources/db (1 files)

### File: onecx-theme-svc/src/main/resources/db/changeLog.xml

```xml

<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd">

    <include relativeToChangelogFile="true" file="v1/2023-11-09-create-tables.xml"/>
    <include relativeToChangelogFile="true" file="v1/2023-11-09-data-import-log.xml"/>
    <include relativeToChangelogFile="true" file="v1/2024-05-27-operator-attribute.xml"/>
    <include relativeToChangelogFile="true" file="v1/2024-06-12-drop-not-null.xml"/>
    <include relativeToChangelogFile="true" file="v1/2024-07-04-display-name-added.xml"/>
    <include relativeToChangelogFile="true" file="v1/2025-02-26-mandatory-attribute.xml"/>
    <include relativeToChangelogFile="true" file="v1/2025-09-29-add-small-logo-url.xml"/>
    <include relativeToChangelogFile="true" file="v1/2025-11-24-add-overrides.xml"/>
    <include relativeToChangelogFile="true" file="v1/2025-11-24-create-overrides-table.xml"/>
    <include relativeToChangelogFile="true" file="v1/2025-12-08-create-icon-table.xml"/>

</databaseChangeLog>

```

## Folder: onecx-theme-svc/src/main/resources/db/v1 (10 files)

### File: onecx-theme-svc/src/main/resources/db/v1/2023-11-09-create-tables.xml

```xml

<?xml version="1.1" encoding="UTF-8" standalone="no"?>

<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd"
        objectQuotingStrategy="QUOTE_ONLY_RESERVED_WORDS">

        <changeSet author="dev (generated)" id="1699550634274-1">

            <createTable tableName="theme">
                <column name="optlock" type="INTEGER">
                    <constraints nullable="false"/>
                </column>
                <column name="assets_update_date" type="TIMESTAMP WITHOUT TIME ZONE"/>
                <column name="creationdate" type="TIMESTAMP WITHOUT TIME ZONE"/>
                <column name="modificationdate" type="TIMESTAMP WITHOUT TIME ZONE"/>
                <column name="assets_url" type="VARCHAR(255)"/>
                <column name="css_file" type="VARCHAR(255)"/>
                <column name="description" type="VARCHAR(255)"/>
                <column name="guid" type="VARCHAR(255)">
                    <constraints nullable="false" primaryKey="true" primaryKeyName="theme_pkey"/>
                </column>
                <column name="favicon_url" type="VARCHAR(255)"/>
                <column name="logo_url" type="VARCHAR(255)"/>
                <column name="name" type="VARCHAR(255)"/>
                <column name="preview_image_url" type="VARCHAR(255)"/>
                <column name="properties" type="TEXT"/>
                <column name="creationuser" type="VARCHAR(255)"/>
                <column name="modificationuser" type="VARCHAR(255)"/>
                <column name="tenant_id" type="varchar(255 BYTE)">
                    <constraints nullable="false"/>
                </column>
            </createTable>
            <addUniqueConstraint columnNames="name, tenant_id" constraintName="theme_name" tableName="theme"/>

            <createTable tableName="image">
                <column name="data_length" type="INTEGER"/>
                <column name="optlock" type="INTEGER">
                    <constraints nullable="false"/>
                </column>
                <column name="creationdate" type="TIMESTAMP WITHOUT TIME ZONE"/>
                <column name="modificationdate" type="TIMESTAMP WITHOUT TIME ZONE"/>
                <column name="guid" type="VARCHAR(255)">
                    <constraints nullable="false" primaryKey="true" primaryKeyName="image_pkey"/>
                </column>
                <column name="mime_type" type="VARCHAR(255)"/>
                <column name="ref_id" type="VARCHAR(255)"/>
                <column name="ref_type" type="VARCHAR(255)"/>
                <column name="tenant_id" type="VARCHAR(255)">
                    <constraints nullable="false"/>
                </column>
                <column name="creationuser" type="VARCHAR(255)"/>
                <column name="modificationuser" type="VARCHAR(255)"/>
                <column name="data" type="BYTEA"/>
            </createTable>
            <addUniqueConstraint columnNames="ref_id, ref_type, tenant_id" constraintName="image_constraints" tableName="image"/>

        </changeSet>

    </databaseChangeLog>



```

### File: onecx-theme-svc/src/main/resources/db/v1/2023-11-09-data-import-log.xml

```xml

<?xml version="1.1" encoding="UTF-8" standalone="no"?>
<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd"
                       objectQuotingStrategy="QUOTE_ONLY_RESERVED_WORDS">

        <changeSet author="dev (generated)" id="dataimportlog-1">
            <createTable tableName="dataimportlog">
                <column name="id" type="VARCHAR(255)">
                    <constraints nullable="false" primaryKey="true" primaryKeyName="dataimportlog_pkey"/>
                </column>
                <column name="creationdate" type="TIMESTAMP WITHOUT TIME ZONE"/>
                <column name="modificationdate" type="TIMESTAMP WITHOUT TIME ZONE"/>
                <column name="file" type="VARCHAR(255)"/>
                <column name="md5" type="VARCHAR(255)"/>
                <column name="error" type="VARCHAR(255)"/>
            </createTable>
        </changeSet>

</databaseChangeLog>


```

### File: onecx-theme-svc/src/main/resources/db/v1/2024-05-27-operator-attribute.xml

```xml

<?xml version="1.1" encoding="UTF-8" standalone="no"?>
<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd"
        objectQuotingStrategy="QUOTE_ONLY_RESERVED_WORDS">

    <changeSet author="dev (generated)" id="1716816363825-1">
        <addColumn tableName="theme">
            <column name="operator" type="bool" defaultValueBoolean="false"/>
        </addColumn>
        <addColumn tableName="image">
            <column name="operator" type="bool" defaultValueBoolean="false" />
        </addColumn>

        <addNotNullConstraint tableName="theme" columnName="operator" constraintName="theme_operator"
                              defaultNullValue="false"/>
        <addNotNullConstraint tableName="image" columnName="operator" constraintName="image_operator"
                              defaultNullValue="false" />
    </changeSet>

</databaseChangeLog>


```

### File: onecx-theme-svc/src/main/resources/db/v1/2024-06-12-drop-not-null.xml

```xml

<?xml version="1.1" encoding="UTF-8" standalone="no"?>
<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd"
        objectQuotingStrategy="QUOTE_ONLY_RESERVED_WORDS">

    <changeSet author="dev (generated)" id="1718176871709-1">
        <dropNotNullConstraint columnDataType="boolean" columnName="operator" tableName="theme"/>
        <dropDefaultValue columnDataType="boolean" columnName="operator" tableName="theme"/>
    </changeSet>
</databaseChangeLog>


```

### File: onecx-theme-svc/src/main/resources/db/v1/2024-07-04-display-name-added.xml

```xml

<?xml version="1.1" encoding="UTF-8" standalone="no"?>
<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd"
        objectQuotingStrategy="QUOTE_ONLY_RESERVED_WORDS">

    <changeSet author="dev (generated)" id="1716816363325-1">
        <addColumn tableName="theme">
            <column name="display_name" type="VARCHAR(255)"/>
        </addColumn>
        <sql>
            UPDATE theme SET display_name = name;
        </sql>
    </changeSet>

</databaseChangeLog>

```

### File: onecx-theme-svc/src/main/resources/db/v1/2025-02-26-mandatory-attribute.xml

```xml

<?xml version="1.1" encoding="UTF-8" standalone="no"?>
<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd"
        objectQuotingStrategy="QUOTE_ONLY_RESERVED_WORDS">
    <changeSet author="dev (generated)" id="1740564919019-1">
        <addColumn tableName="theme">
            <column name="mandatory" type="boolean"/>
        </addColumn>
    </changeSet>
</databaseChangeLog>


```

### File: onecx-theme-svc/src/main/resources/db/v1/2025-09-29-add-small-logo-url.xml

```xml

<?xml version="1.1" encoding="UTF-8" standalone="no"?>

<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd"
        objectQuotingStrategy="QUOTE_ONLY_RESERVED_WORDS">
    <changeSet author="dev (generated)" id="1759152915555-1">
        <addColumn tableName="theme">
            <column name="small_logo_url" type="VARCHAR(255)"/>
        </addColumn>
    </changeSet>
</databaseChangeLog>


```

### File: onecx-theme-svc/src/main/resources/db/v1/2025-11-24-add-overrides.xml

```xml

<?xml version="1.1" encoding="UTF-8" standalone="no"?>

<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd"
        objectQuotingStrategy="QUOTE_ONLY_RESERVED_WORDS">
    <changeSet author="dev (generated)" id="1763974368127-1">
        <addColumn tableName="theme">
            <column name="overrides" type="TEXT"/>
        </addColumn>
    </changeSet>
</databaseChangeLog>

```

### File: onecx-theme-svc/src/main/resources/db/v1/2025-11-24-create-overrides-table.xml

```xml

<?xml version="1.1" encoding="UTF-8" standalone="no"?>

<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd"
        objectQuotingStrategy="QUOTE_ONLY_RESERVED_WORDS">
    <changeSet author="dev (generated)" id="1763992950250-1">
        <createTable tableName="theme_override">
            <column name="guid" type="VARCHAR(255)">
                <constraints nullable="false" primaryKey="true" primaryKeyName="theme_override_pkey"/>
            </column>
            <column name="theme_id" type="VARCHAR(255)"/>
            <column name="type" type="VARCHAR(255)"/>
            <column name="value" type="VARCHAR(255)"/>
        </createTable>
        <addForeignKeyConstraint baseColumnNames="theme_id" baseTableName="theme_override" constraintName="fk_override_value" onDelete="CASCADE" onUpdate="NO ACTION" referencedColumnNames="guid" referencedTableName="theme"/>
        <addUniqueConstraint columnNames="theme_id, type" constraintName="override_type" tableName="theme_override"/>
        <dropColumn columnName="overrides" tableName="theme"/>
    </changeSet>
</databaseChangeLog>

```

### File: onecx-theme-svc/src/main/resources/db/v1/2025-12-08-create-icon-table.xml

```xml

<?xml version="1.1" encoding="UTF-8" standalone="no"?>

<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd"
        objectQuotingStrategy="QUOTE_ONLY_RESERVED_WORDS">
    <changeSet author="dev (generated)" id="1763992950250-1">
        <createTable tableName="icon">
            <column name="optlock" type="INTEGER">
                <constraints nullable="false"/>
            </column>
            <column name="creationdate" type="TIMESTAMP WITHOUT TIME ZONE"/>
            <column name="modificationdate" type="TIMESTAMP WITHOUT TIME ZONE"/>
            <column name="body" type="TEXT"/>
            <column name="guid" type="VARCHAR(255)">
                <constraints nullable="false" primaryKey="true" primaryKeyName="icon_pkey"/>
            </column>
            <column name="name" type="VARCHAR(255)"/>
            <column name="parent" type="VARCHAR(255)"/>
            <column name="ref_id" type="VARCHAR(255)"/>
            <column name="tenant_id" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="type" type="VARCHAR(255)"/>
            <column name="creationuser" type="VARCHAR(255)"/>
            <column name="modificationuser" type="VARCHAR(255)"/>
        </createTable>
        <createIndex indexName="icon_ref_id_idx" tableName="icon" using="btree">
            <column name="ref_id"/>
        </createIndex>
        <addUniqueConstraint columnNames="name, ref_id, tenant_id" constraintName="icon_name" tableName="icon"/>
    </changeSet>
</databaseChangeLog>


```

## Folder: onecx-theme-svc/src/main/resources/import (1 files)

### File: onecx-theme-svc/src/main/resources/import/template.json

```json

{
  "themes": {
    "OneCX": {
      "displayName": "OneCX Theme",
      "cssFile": null,
      "description": "OneCX Theme",
      "assetsUrl": null,
      "logoUrl": null,
      "faviconUrl": null,
      "previewImageUrl": null,
      "assetsUpdateDate": null,
      "properties": {
        "font": {
          "font-family": null,
          "font-size": null
        },
        "topbar": {
          "topbar-bg-color": "#0D3650",
          "topbar-item-text-color": " #ffffff",
          "topbar-text-color": "#ffffff",
          "topbar-left-bg-color": "#0D3650",
          "topbar-item-text-hover-bg-color": "#262626",
          "topbar-menu-button-bg-color": " rgb(255 0 68)",
          "logo-color": " #ffffff"
        },
        "general": {
          "primary-color": "#274B5F",
          "secondary-color": "#1C4257",
          "text-color": " rgba(0, 0, 0, 0.87)",
          "text-secondary-color": "#262626",
          "body-bg-color": " #f7f7f7",
          "content-bg-color": " #ffffff",
          "content-alt-bg-color": " #ffffff",
          "overlay-content-bg-color": " #ffffff",
          "hover-bg-color": "#ad1457",
          "solid-surface-text-color": " #ffffff",
          "divider-color": " #e4e4e4",
          "button-hover-bg": "#ad1457",
          "button-active-bg": null,
          "danger-button-bg": "#D32F2F",
          "info-message-bg": "#b3e5fc",
          "success-message-bg": "#c8e6c9",
          "warning-message-bg": "#ffecb3",
          "error-message-bg": "#ffcdd2"
        },
        "sidebar": {
          "menu-text-color": "#274B5F",
          "menu-bg-color": " #fdfeff",
          "menu-item-text-color": " #515c66",
          "menu-item-hover-bg-color": " #e4e4e4",
          "menu-active-item-text-color": " #515c66",
          "menu-active-item-bg-color": " rgba(0, 0, 0, 0.04)",
          "inline-menu-border-color": " #e4e4e4"
        }
      },
      "images" : {
        "logo": {
          "imageData": "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",
          "mimeType": "image/*"
        },
        "favicon": {
          "imageData": "AAABAAMAMDAAAAEAIACoJQAANgAAACAgAAABACAAqBAAAN4lAAAQEAAAAQAgAGgEAACGNgAAKAAAADAAAABgAAAAAQAgAAAAAAAAJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AADA/+B/B/8AAID/wD4D/wAAgP+AHAf/AACA/4AMB/8AAID/AAgP/wAAgP4AAB//AACA/gAAH/8AAID8AAA//QAAgPwAAH/+AACA+AAAf/0AAID4AAD/8AAAgPAAAH+AAACA4AAAPgAAAIDgAAAAAQAAgMBgAAABAACAwGAAAAEAAIAA4AAAAwAAgAHgCAAHAACAAeAcAA8AAIAD4B4AHwAAgAPgP4B/AACAB+A///8AAIAP4D///wAAgA/gP///AACAH+A///8AAIAf4D///wAAgD/gP///AACAf+A///8AAIB/4D///wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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",
          "mimeType": "image/*"
        }
      }
    }
  }
}

```

## Folder: onecx-theme-svc/src/test/java/org/tkit/onecx/theme (1 files)

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/AfterStartThemeDataImportTest.java

```java

package org.tkit.onecx.theme;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.inject.Inject;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.tkit.onecx.theme.domain.daos.ThemeDAO;
import org.tkit.onecx.theme.test.AbstractTest;

import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@DisplayName("Theme data import test from example file")
class AfterStartThemeDataImportTest extends AbstractTest {

    @Inject
    ThemeDAO dao;

    @Test
    @DisplayName("Import theme data from file")
    void importDataFromFileTest() {
        var data = dao.findAllAsList();
        assertThat(data).isNotNull().hasSize(3);
        assertThat(data.get(0)).isNotNull();
    }

}


```

## Folder: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/domain/daos (5 files)

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/domain/daos/IconDAOTest.java

```java

package org.tkit.onecx.theme.domain.daos;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.mockito.Mockito;
import org.tkit.onecx.theme.test.AbstractTest;
import org.tkit.quarkus.jpa.exceptions.DAOException;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
class IconDAOTest extends AbstractTest {

    @Inject
    IconDAO dao;

    @InjectMock
    EntityManager em;

    @BeforeEach
    void beforeAll() {
        Mockito.when(em.getCriteriaBuilder()).thenThrow(new RuntimeException("Test technical error exception"));
    }

    @Test
    void methodExceptionTests() {
        methodExceptionTests(() -> dao.findIconsByNamesAndRefId(null, null),
                IconDAO.ErrorKeys.ERROR_FIND_ICONS_BY_NAMES_AND_REF_ID);
        methodExceptionTests(() -> dao.findByNameAndRefId(null, null),
                IconDAO.ErrorKeys.FIND_ENTITY_BY_PARENT_NAME_FAILED);
        methodExceptionTests(() -> dao.deleteQueryByRefId(null),
                IconDAO.ErrorKeys.FAILED_TO_DELETE_BY_REF_ID_QUERY);
    }

    void methodExceptionTests(Executable fn, Enum<?> key) {
        var exc = Assertions.assertThrows(DAOException.class, fn);
        Assertions.assertEquals(key, exc.key);
    }
}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/domain/daos/ImageDAOTest.java

```java

package org.tkit.onecx.theme.domain.daos;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.mockito.Mockito;
import org.tkit.onecx.theme.test.AbstractTest;
import org.tkit.quarkus.jpa.exceptions.DAOException;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
class ImageDAOTest extends AbstractTest {
    @Inject
    ImageDAO dao;

    @InjectMock
    EntityManager em;

    @BeforeEach
    void beforeAll() {
        Mockito.when(em.getCriteriaBuilder()).thenThrow(new RuntimeException("Test technical error exception"));
    }

    @Test
    void methodExceptionTests() {
        methodExceptionTests(() -> dao.deleteQueryByRefIds(null),
                ImageDAO.ErrorKeys.FAILED_TO_DELETE_BY_REF_IDS_QUERY);
        methodExceptionTests(() -> dao.findByRefIds(null),
                ImageDAO.ErrorKeys.ERROR_FIND_REF_IDS);
        methodExceptionTests(() -> dao.deleteQueryByRefId("1"),
                ImageDAO.ErrorKeys.FAILED_TO_DELETE_BY_REF_ID_QUERY);
        methodExceptionTests(() -> dao.findByRefIdAndRefType(null, null),
                ImageDAO.ErrorKeys.FIND_ENTITY_BY_REF_ID_REF_TYPE_FAILED);
        methodExceptionTests(() -> dao.findByRefIdAndRefType(null, null),
                ImageDAO.ErrorKeys.FIND_ENTITY_BY_REF_ID_REF_TYPE_FAILED);
        methodExceptionTests(() -> dao.deleteQueryByRefIdAndRefType("1", "LOGO"),
                ImageDAO.ErrorKeys.FAILED_TO_DELETE_BY_REF_ID_REF_TYPE_QUERY);
        methodExceptionTests(() -> dao.findRefIdRefTypesByRefId(null),
                ImageDAO.ErrorKeys.FIND_REF_TYPES_BY_REF_ID);
        methodExceptionTests(() -> dao.findAllTypesByRefId(null),
                ImageDAO.ErrorKeys.ERROR_FIND_ALL_REF_TYPES_BY_REF_ID);
    }

    void methodExceptionTests(Executable fn, Enum<?> key) {
        var exc = Assertions.assertThrows(DAOException.class, fn);
        Assertions.assertEquals(key, exc.key);
    }
}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/domain/daos/ImageExtendedDAOTest.java

```java

package org.tkit.onecx.theme.domain.daos;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import jakarta.inject.Inject;

import org.junit.jupiter.api.Test;
import org.tkit.onecx.theme.test.AbstractTest;

import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
class ImageExtendedDAOTest extends AbstractTest {
    @Inject
    ImageDAO dao;

    @Test
    void methodNoErrorTest() {
        assertDoesNotThrow(() -> dao.deleteQueryByRefId(null));
    }

}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/domain/daos/ThemeDAOTest.java

```java

package org.tkit.onecx.theme.domain.daos;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.mockito.Mockito;
import org.tkit.onecx.theme.test.AbstractTest;
import org.tkit.quarkus.jpa.exceptions.DAOException;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
class ThemeDAOTest extends AbstractTest {
    @Inject
    ThemeDAO dao;

    @InjectMock
    EntityManager em;

    @BeforeEach
    void beforeAll() {
        Mockito.when(em.getCriteriaBuilder()).thenThrow(new RuntimeException("Test technical error exception"));
    }

    @Test
    void methodExceptionTests() {
        methodExceptionTests(() -> dao.deleteQueryByNames(null),
                ThemeDAO.ErrorKeys.ERROR_DELETE_QUERY_BY_NAMES);
        methodExceptionTests(() -> dao.findById(null),
                ThemeDAO.ErrorKeys.FIND_ENTITY_BY_ID_FAILED);
        methodExceptionTests(() -> dao.findThemesByCriteria(null),
                ThemeDAO.ErrorKeys.ERROR_FIND_THEMES_BY_CRITERIA);
        methodExceptionTests(() -> dao.findThemeByName(null),
                ThemeDAO.ErrorKeys.ERROR_FIND_THEME_BY_NAME);
        methodExceptionTests(() -> dao.findThemeByNames(null),
                ThemeDAO.ErrorKeys.ERROR_FIND_THEME_BY_NAMES);
        methodExceptionTests(() -> dao.findNamesByThemeByNames(null),
                ThemeDAO.ErrorKeys.ERROR_FIND_NAMES_BY_NAMES);
        methodExceptionTests(() -> dao.findAllInfos(),
                ThemeDAO.ErrorKeys.ERROR_FIND_ALL_THEME_INFO);
    }

    void methodExceptionTests(Executable fn, Enum<?> key) {
        var exc = Assertions.assertThrows(DAOException.class, fn);
        Assertions.assertEquals(key, exc.key);
    }
}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/domain/daos/ThemeOverrideDAOTest.java

```java

package org.tkit.onecx.theme.domain.daos;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.mockito.Mockito;
import org.tkit.onecx.theme.test.AbstractTest;
import org.tkit.quarkus.jpa.exceptions.DAOException;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
class ThemeOverrideDAOTest extends AbstractTest {
    @Inject
    ThemeOverrideDAO dao;

    @InjectMock
    EntityManager em;

    @BeforeEach
    void beforeAll() {
        Mockito.when(em.getCriteriaBuilder()).thenThrow(new RuntimeException("Test technical error exception"));
    }

    @Test
    void methodExceptionTests() {
        methodExceptionTests(() -> dao.findByThemeId(null),
                ThemeOverrideDAO.ErrorKeys.ERROR_FIND_THEME_OVERRIDES_BY_THEME_ID);
    }

    void methodExceptionTests(Executable fn, Enum<?> key) {
        var exc = Assertions.assertThrows(DAOException.class, fn);
        Assertions.assertEquals(key, exc.key);
    }
}


```

## Folder: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/domain/di (1 files)

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/domain/di/TemplateImportServiceTest.java

```java

package org.tkit.onecx.theme.domain.di;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.inject.Inject;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.tkit.onecx.theme.domain.daos.ThemeDAO;
import org.tkit.onecx.theme.domain.models.Theme;
import org.tkit.onecx.theme.test.AbstractTest;
import org.tkit.quarkus.dataimport.DataImportConfig;
import org.tkit.quarkus.test.WithDBData;

import com.fasterxml.jackson.databind.ObjectMapper;

import gen.org.tkit.onecx.theme.di.template.model.TemplateImportDTO;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@WithDBData(value = "data/testdata-internal.xml", deleteBeforeInsert = true, deleteAfterTest = true, rinseAndRepeat = true)
class TemplateImportServiceTest extends AbstractTest {

    @Inject
    TemplateImportService service;

    @Inject
    ThemeDAO dao;

    @Inject
    ObjectMapper mapper;

    @Test
    void importDataNotSupportedActionTest() {

        Map<String, String> metadata = new HashMap<>();
        metadata.put("operation", "CUSTOM_NOT_SUPPORTED");
        DataImportConfig config = new DataImportConfig() {
            @Override
            public Map<String, String> getMetadata() {
                return metadata;
            }
        };

        service.importData(config);

        List<Theme> data = dao.findAllAsList();
        assertThat(data).isNotNull().hasSize(3);

    }

    @Test
    void importEmptyDataTest() {
        Assertions.assertThrows(Exception.class, () -> {
            service.importData(new DataImportConfig() {
                @Override
                public Map<String, String> getMetadata() {
                    return Map.of("tenants", "default");
                }
            });

            service.importData(new DataImportConfig() {
                @Override
                public Map<String, String> getMetadata() {
                    return Map.of("tenants", "default");
                }

                @Override
                public byte[] getData() {
                    return new byte[] {};
                }
            });
        });
        Assertions.assertDoesNotThrow(() -> {

            service.importData(new DataImportConfig() {
                @Override
                public Map<String, String> getMetadata() {
                    return Map.of("tenants", "default");
                }

                @Override
                public byte[] getData() {
                    try {
                        return mapper.writeValueAsBytes(new TemplateImportDTO().themes(null));
                    } catch (Exception ex) {
                        throw new RuntimeException(ex);
                    }
                }
            });

            service.importData(new DataImportConfig() {
                @Override
                public Map<String, String> getMetadata() {
                    return Map.of("tenants", "default");
                }

                @Override
                public byte[] getData() {
                    try {
                        return mapper.writeValueAsBytes(new TemplateImportDTO().themes(Map.of()));
                    } catch (Exception ex) {
                        throw new RuntimeException(ex);
                    }
                }
            });

        });

        var config = new DataImportConfig() {
            @Override
            public Map<String, String> getMetadata() {
                return Map.of("tenants", "default");
            }

            @Override
            public byte[] getData() {
                return new byte[] { 0 };
            }
        };
        Assertions.assertThrows(TemplateImportService.ImportException.class, () -> service.importData(config));

    }
}


```

## Folder: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/admin/v1/controllers (2 files)

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/admin/v1/controllers/ThemesAdminRestControllerV1Test.java

```java

package org.tkit.onecx.theme.rs.admin.v1.controllers;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static jakarta.ws.rs.core.Response.Status.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.from;

import jakarta.ws.rs.core.Response;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.tkit.onecx.theme.test.AbstractTest;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;
import org.tkit.quarkus.test.WithDBData;

import gen.org.tkit.onecx.theme.rs.admin.v1.model.*;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@TestHTTPEndpoint(ThemesAdminRestControllerV1.class)
@WithDBData(value = "data/testdata-admin.xml", deleteBeforeInsert = true, deleteAfterTest = true, rinseAndRepeat = true)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-th:admin-read", "ocx-th:admin-write",
        "ocx-th:admin-delete" })
class ThemesAdminRestControllerV1Test extends AbstractTest {

    @Test
    void createNewThemeTest() {

        // create theme
        var createThemeRequestDTO = new CreateThemeRequestDTOAdminV1();
        var themeDto = new CreateThemeDTOAdminV1().name("test01").displayName("test01");
        themeDto.setCssFile("cssFile");
        themeDto.setDescription("description");
        themeDto.setAssetsUrl("assets/url");
        themeDto.setPreviewImageUrl("image/url");

        createThemeRequestDTO.setResource(themeDto);

        var res = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(createThemeRequestDTO)
                .post()
                .then().log().all().statusCode(CREATED.getStatusCode())
                .extract().as(CreateThemeResponseDTOAdminV1.class);

        var dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .get(res.getResource().getId())
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .extract()
                .body().as(ThemeDTOAdminV1.class);

        assertThat(dto).isNotNull()
                .returns(themeDto.getName(), from(ThemeDTOAdminV1::getName))
                .returns(themeDto.getDescription(), from(ThemeDTOAdminV1::getDescription))
                .returns(themeDto.getAssetsUrl(), from(ThemeDTOAdminV1::getAssetsUrl))
                .returns(themeDto.getPreviewImageUrl(), from(ThemeDTOAdminV1::getPreviewImageUrl));

        // create theme without body
        var exception = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .post()
                .then()
                .statusCode(BAD_REQUEST.getStatusCode())
                .extract().as(ProblemDetailResponseDTOAdminV1.class);

        assertThat(exception.getErrorCode()).isEqualTo("CONSTRAINT_VIOLATIONS");
        assertThat(exception.getDetail()).isEqualTo("createNewTheme.createThemeRequestDTOAdminV1: must not be null");

        // create theme with existing name
        themeDto = new CreateThemeDTOAdminV1();
        themeDto.setName("cg");
        themeDto.setDisplayName("cg-display");
        createThemeRequestDTO.setResource(themeDto);

        exception = given()
                .auth().oauth2(getKeycloakClientToken("testClient")).when()
                .contentType(APPLICATION_JSON)
                .body(createThemeRequestDTO)
                .post()
                .then()
                .statusCode(BAD_REQUEST.getStatusCode())
                .extract().as(ProblemDetailResponseDTOAdminV1.class);

        assertThat(exception.getErrorCode()).isEqualTo("PERSIST_ENTITY_FAILED");
        assertThat(exception.getDetail()).isEqualTo(
                "could not execute statement [ERROR: duplicate key value violates unique constraint 'theme_name'  Detail: Key (name, tenant_id)=(cg, default) already exists.]");
    }

    @Test
    void deleteThemeTest() {

        // delete theme
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("id", "DELETE_1")
                .delete("{id}")
                .then().statusCode(NO_CONTENT.getStatusCode());

        // check if theme exists
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("id", "DELETE_1")
                .get("{id}")
                .then().statusCode(NOT_FOUND.getStatusCode());

        // delete theme in portal
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("id", "11-111")
                .delete("{id}")
                .then()
                .statusCode(NO_CONTENT.getStatusCode());

    }

    @Test
    void getThemeByIdTest() {

        var dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("id", "22-222")
                .get("{id}")
                .then().statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(ThemeDTOAdminV1.class);

        assertThat(dto).isNotNull();
        assertThat(dto.getName()).isEqualTo("themeWithoutPortal");
        assertThat(dto.getId()).isEqualTo("22-222");

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("id", "___")
                .get("{id}")
                .then().statusCode(NOT_FOUND.getStatusCode());

        dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("id", "11-111")
                .get("{id}")
                .then().statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(ThemeDTOAdminV1.class);

        assertThat(dto).isNotNull();
        assertThat(dto.getName()).isEqualTo("cg");
        assertThat(dto.getId()).isEqualTo("11-111");

    }

    @Test
    void searchThemesTest() {
        var criteria = new ThemeSearchCriteriaDTOAdminV1();

        var data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .body(criteria)
                .post("/search")
                .then()
                .statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .as(ThemePageResultDTOAdminV1.class);

        assertThat(data).isNotNull();
        assertThat(data.getTotalElements()).isEqualTo(3);
        assertThat(data.getStream()).isNotNull().hasSize(3);

        criteria.setName(" ");
        data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .body(criteria)
                .post("/search")
                .then()
                .statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .as(ThemePageResultDTOAdminV1.class);

        assertThat(data).isNotNull();
        assertThat(data.getTotalElements()).isEqualTo(3);
        assertThat(data.getStream()).isNotNull().hasSize(3);

        criteria.setName("cg");
        data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .body(criteria)
                .post("/search")
                .then()
                .statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .as(ThemePageResultDTOAdminV1.class);

        assertThat(data).isNotNull();
        assertThat(data.getTotalElements()).isEqualTo(1);
        assertThat(data.getStream()).isNotNull().hasSize(1);

    }

    @Test
    void updateThemeTest() {

        var updateThemeRequestDTO = new UpdateThemeRequestDTOAdminV1();
        // update none existing theme
        var themeDto = new UpdateThemeDTOAdminV1();
        themeDto.setName("test01");
        themeDto.setDisplayName("test01");
        themeDto.setModificationCount(0);
        themeDto.setDescription("description-update");

        updateThemeRequestDTO.setResource(themeDto);

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .body(updateThemeRequestDTO)
                .when()
                .pathParam("id", "does-not-exists")
                .put("{id}")
                .then().statusCode(NOT_FOUND.getStatusCode());

        // update theme
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .body(updateThemeRequestDTO)
                .when()
                .pathParam("id", "11-111")
                .put("{id}")
                .then().statusCode(NO_CONTENT.getStatusCode());

        // download theme
        var dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient")).contentType(APPLICATION_JSON)
                .body(themeDto)
                .when()
                .pathParam("id", "11-111")
                .get("{id}")
                .then().statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(ThemeDTOAdminV1.class);

        // update theme with wrong modificationCount
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .body(updateThemeRequestDTO)
                .when()
                .pathParam("id", "11-111")
                .put("{id}")
                .then().statusCode(BAD_REQUEST.getStatusCode());

        assertThat(dto).isNotNull();
        assertThat(dto.getDescription()).isEqualTo(themeDto.getDescription());

    }

    @Test
    void updateThemeWithExistingNameTest() {

        var updateThemeRequestDTO = new UpdateThemeRequestDTOAdminV1();

        var themeDto = new UpdateThemeDTOAdminV1();
        themeDto.setName("themeWithoutPortal");
        themeDto.setDisplayName("themeWithoutPortal");
        themeDto.setModificationCount(0);
        themeDto.setDescription("description");

        updateThemeRequestDTO.setResource(themeDto);

        var exception = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .when()
                .body(updateThemeRequestDTO)
                .pathParam("id", "11-111")
                .put("{id}")
                .then()
                .statusCode(BAD_REQUEST.getStatusCode())
                .extract().as(ProblemDetailResponseDTOAdminV1.class);

        Assertions.assertNotNull(exception);
        Assertions.assertEquals("MERGE_ENTITY_FAILED", exception.getErrorCode());
        Assertions.assertEquals(
                "could not execute statement [ERROR: duplicate key value violates unique constraint 'theme_name'  Detail: Key (name, tenant_id)=(themeWithoutPortal, default) already exists.]",
                exception.getDetail());
        Assertions.assertNotNull(exception.getInvalidParams());
        Assertions.assertTrue(exception.getInvalidParams().isEmpty());
    }

    @Test
    void updateThemeWithoutBodyTest() {

        var exception = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .when()
                .pathParam("id", "update_create_new")
                .put("{id}")
                .then()
                .statusCode(BAD_REQUEST.getStatusCode())
                .extract().as(ProblemDetailResponseDTOAdminV1.class);

        Assertions.assertNotNull(exception);
        Assertions.assertEquals("CONSTRAINT_VIOLATIONS", exception.getErrorCode());
        Assertions.assertEquals("updateTheme.updateThemeRequestDTOAdminV1: must not be null",
                exception.getDetail());
        Assertions.assertNotNull(exception.getInvalidParams());
        Assertions.assertEquals(1, exception.getInvalidParams().size());
    }
}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/admin/v1/controllers/ThemesAdminRestControllerV1TestIT.java

```java

package org.tkit.onecx.theme.rs.admin.v1.controllers;

import io.quarkus.test.junit.QuarkusIntegrationTest;

@QuarkusIntegrationTest
class ThemesAdminRestControllerV1TestIT extends ThemesAdminRestControllerV1Test {
}


```

## Folder: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/exim/v1/controllers (3 files)

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/exim/v1/controllers/ExportImportRestControllerV1ExceptionTest.java

```java

package org.tkit.onecx.theme.rs.exim.v1.controllers;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static jakarta.ws.rs.core.Response.Status.*;
import static org.mockito.ArgumentMatchers.any;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.tkit.onecx.theme.domain.daos.ThemeDAO;
import org.tkit.onecx.theme.test.AbstractTest;
import org.tkit.quarkus.jpa.exceptions.DAOException;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;

import gen.org.tkit.onecx.theme.rs.exim.v1.model.ExportThemeRequestDTOV1;
import io.quarkus.test.InjectMock;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@TestHTTPEndpoint(ExportImportRestControllerV1.class)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-th:read", "ocx-th:write" })
class ExportImportRestControllerV1ExceptionTest extends AbstractTest {

    @InjectMock
    ThemeDAO dao;

    @BeforeEach
    void beforeAll() {
        Mockito.when(dao.findThemeByNames(any()))
                .thenThrow(new RuntimeException("Test technical error exception"))
                .thenThrow(new DAOException(ThemeDAO.ErrorKeys.ERROR_FIND_THEMES_BY_CRITERIA, new RuntimeException("Test")));
    }

    @Test
    void exportThemesExceptionTest() {

        var request = new ExportThemeRequestDTOV1();

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(request)
                .post("export")
                .then()
                .statusCode(INTERNAL_SERVER_ERROR.getStatusCode());

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(request)
                .post("export")
                .then()
                .statusCode(INTERNAL_SERVER_ERROR.getStatusCode());

    }
}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/exim/v1/controllers/ExportImportRestControllerV1TenantTest.java

```java

package org.tkit.onecx.theme.rs.exim.v1.controllers;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static jakarta.ws.rs.core.Response.Status.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.from;

import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.tkit.onecx.theme.test.AbstractTest;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;
import org.tkit.quarkus.test.WithDBData;

import gen.org.tkit.onecx.theme.rs.exim.v1.model.*;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@TestHTTPEndpoint(ExportImportRestControllerV1.class)
@WithDBData(value = "data/testdata-exim.xml", deleteBeforeInsert = true, deleteAfterTest = true, rinseAndRepeat = true)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-th:read", "ocx-th:write" })
class ExportImportRestControllerV1TenantTest extends AbstractTest {

    @Test
    void exportThemesTest() {

        var request = new ExportThemeRequestDTOV1();

        var dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .body(request)
                .post("export")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ThemeSnapshotDTOV1.class);
        assertThat(dto).isNotNull();
        assertThat(dto.getThemes()).hasSize(2);

        request.setNames(new HashSet<>());
        dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org2"))
                .body(request)
                .post("export")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ThemeSnapshotDTOV1.class);
        assertThat(dto).isNotNull();
        assertThat(dto.getThemes()).hasSize(1);

        request.setNames(Set.of("cg", "themeWithoutPortal"));
        dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .body(request)
                .post("export")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ThemeSnapshotDTOV1.class);
        assertThat(dto).isNotNull();
        assertThat(dto.getThemes()).hasSize(2);

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org2"))
                .body(request)
                .post("export")
                .then()
                .statusCode(NOT_FOUND.getStatusCode());

    }

    @Test
    void exportThemesWrongNamesTest() {

        var request = new ExportThemeRequestDTOV1();
        request.setNames(Set.of("does-not-exists"));

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org2"))
                .body(request)
                .post("export")
                .then()
                .statusCode(NOT_FOUND.getStatusCode());
    }

    @Test
    void exportThemesEmptyBodyTest() {

        var exception = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .post("export")
                .then()
                .statusCode(BAD_REQUEST.getStatusCode())
                .extract().as(EximProblemDetailResponseDTOV1.class);

        assertThat(exception.getErrorCode()).isEqualTo("CONSTRAINT_VIOLATIONS");
        assertThat(exception.getDetail()).isEqualTo("exportThemes.exportThemeRequestDTOV1: must not be null");
    }

    @Test
    void importThemesTest() {

        var request = new ThemeSnapshotDTOV1();

        var data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .body(request)
                .post("export")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ThemeSnapshotDTOV1.class);
        assertThat(data).isNotNull();
        assertThat(data.getThemes()).hasSize(2);

        var importTheme = new EximThemeDTOV1();
        importTheme.setDescription("new theme description");
        data.getThemes().put("importTheme", importTheme);

        var dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .body(data)
                .post("import")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ImportThemeResponseDTOV1.class);

        assertThat(dto).isNotNull().returns(data.getId(), from(ImportThemeResponseDTOV1::getId));

        assertThat(dto.getThemes()).isNotNull().hasSize(3);
        assertThat(dto.getThemes().get("cg")).returns(ImportThemeResponseStatusDTOV1.UPDATE.toString(),
                from(ImportThemeResponseStatusDTOV1::toString));
        assertThat(dto.getThemes().get("importTheme")).returns(ImportThemeResponseStatusDTOV1.CREATED.toString(),
                from(ImportThemeResponseStatusDTOV1::toString));
    }

}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/exim/v1/controllers/ExportImportRestControllerV1Test.java

```java

package org.tkit.onecx.theme.rs.exim.v1.controllers;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static jakarta.ws.rs.core.Response.Status.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.from;

import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.tkit.onecx.theme.test.AbstractTest;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;
import org.tkit.quarkus.test.WithDBData;

import gen.org.tkit.onecx.theme.rs.exim.v1.model.*;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@TestHTTPEndpoint(ExportImportRestControllerV1.class)
@WithDBData(value = "data/testdata-exim.xml", deleteBeforeInsert = true, deleteAfterTest = true, rinseAndRepeat = true)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-th:read", "ocx-th:write" })
class ExportImportRestControllerV1Test extends AbstractTest {

    @Test
    void exportThemesTest() {

        var request = new ExportThemeRequestDTOV1();

        var dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(request)
                .post("export")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ThemeSnapshotDTOV1.class);
        assertThat(dto).isNotNull();
        assertThat(dto.getThemes()).hasSize(3);

        dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(new ExportThemeRequestDTOV1().names(null))
                .post("export")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ThemeSnapshotDTOV1.class);
        assertThat(dto).isNotNull();
        assertThat(dto.getThemes()).hasSize(3);

        request.setNames(new HashSet<>());
        dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(request)
                .post("export")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ThemeSnapshotDTOV1.class);
        assertThat(dto).isNotNull();
        assertThat(dto.getThemes()).hasSize(3);

        request.setNames(Set.of("cg", "themeWithoutPortal"));
        dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(request)
                .post("export")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ThemeSnapshotDTOV1.class);
        assertThat(dto).isNotNull();
        assertThat(dto.getThemes()).hasSize(2);
    }

    @Test
    void exportThemesWrongNamesTest() {

        var request = new ExportThemeRequestDTOV1();
        request.setNames(Set.of("does-not-exists"));

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(request)
                .post("export")
                .then()
                .statusCode(NOT_FOUND.getStatusCode());
    }

    @Test
    void exportThemesEmptyBodyTest() {

        var exception = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .post("export")
                .then()
                .statusCode(BAD_REQUEST.getStatusCode())
                .extract().as(EximProblemDetailResponseDTOV1.class);

        assertThat(exception.getErrorCode()).isEqualTo("CONSTRAINT_VIOLATIONS");
        assertThat(exception.getDetail()).isEqualTo("exportThemes.exportThemeRequestDTOV1: must not be null");
    }

    @Test
    void importThemesTest() {

        var request = new ThemeSnapshotDTOV1();

        var data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(request)
                .post("export")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ThemeSnapshotDTOV1.class);
        assertThat(data).isNotNull();
        assertThat(data.getThemes()).hasSize(3);

        var importTheme = new EximThemeDTOV1();
        importTheme.setDescription("new theme description");
        importTheme.putImagesItem("logo", new ImageDTOV1().imageData(new byte[] { 1, 2, 3 }).mimeType("image/*"));
        importTheme.putImagesItem("logo2", new ImageDTOV1().imageData(new byte[] { 1, 2, 3 }).mimeType("image/*"));
        data.getThemes().put("importTheme", importTheme);
        // add new image to existing theme
        data.getThemes().get("cg").putImagesItem("logo2",
                new ImageDTOV1().imageData(new byte[] { 1, 2, 3 }).mimeType("image/*"));

        var dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(data)
                .post("import")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ImportThemeResponseDTOV1.class);

        assertThat(dto).isNotNull().returns(data.getId(), from(ImportThemeResponseDTOV1::getId));

        assertThat(dto.getThemes()).isNotNull().hasSize(4);
        assertThat(dto.getThemes().get("cg")).returns(ImportThemeResponseStatusDTOV1.UPDATE.toString(),
                from(ImportThemeResponseStatusDTOV1::toString));
        assertThat(dto.getThemes().get("importTheme")).returns(ImportThemeResponseStatusDTOV1.CREATED.toString(),
                from(ImportThemeResponseStatusDTOV1::toString));
    }

    @Test
    void importThemeWithoutDisplayNameTest() {

        var request = new ThemeSnapshotDTOV1();

        var data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(request)
                .post("export")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ThemeSnapshotDTOV1.class);
        assertThat(data).isNotNull();
        assertThat(data.getThemes()).hasSize(3);

        var importTheme = new EximThemeDTOV1();
        importTheme.setDescription("new theme description");
        importTheme.putImagesItem("logo", new ImageDTOV1().imageData(new byte[] { 1, 2, 3 }).mimeType("image/*"));
        importTheme.putImagesItem("logo2", new ImageDTOV1().imageData(new byte[] { 1, 2, 3 }).mimeType("image/*"));
        data.getThemes().put("themeWithoutDisplayName", importTheme);

        var dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(data)
                .post("import")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ImportThemeResponseDTOV1.class);

        assertThat(dto).isNotNull().returns(data.getId(), from(ImportThemeResponseDTOV1::getId));

        //check if fallback displayname was used
        var exportResponse = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(request)
                .post("export")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ThemeSnapshotDTOV1.class);

        assertThat(exportResponse).isNotNull();
        assertThat(exportResponse.getThemes()).hasSize(4);
        assertThat(exportResponse.getThemes().get("themeWithoutDisplayName").getDisplayName())
                .isEqualTo("themeWithoutDisplayName");
    }

    @Test
    void importOperatorThemesTest() {

        var request = new ThemeSnapshotDTOV1();

        var data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(request)
                .post("export")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ThemeSnapshotDTOV1.class);
        assertThat(data).isNotNull();
        assertThat(data.getThemes()).hasSize(3);

        data.getThemes().remove("themeWithoutPortal");
        data.getThemes().remove("toDelete");

        var importTheme = new EximThemeDTOV1();
        importTheme.setDescription("new theme description");
        importTheme.putImagesItem("logo", new ImageDTOV1().imageData(new byte[] { 1, 2, 3 }).mimeType("image/*"));
        importTheme.putImagesItem("logo2", new ImageDTOV1().imageData(new byte[] { 1, 2, 3 }).mimeType("image/*"));
        data.getThemes().put("importTheme", importTheme);
        // add new image to existing theme
        data.getThemes().get("cg").putImagesItem("logo2",
                new ImageDTOV1().imageData(new byte[] { 1, 2, 3 }).mimeType("image/*"));

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(data)
                .post("operator")
                .then()
                .statusCode(OK.getStatusCode());

        data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(request)
                .post("export")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ThemeSnapshotDTOV1.class);
        assertThat(data).isNotNull();
        assertThat(data.getThemes()).hasSize(4);

        assertThat(data.getThemes().get("cg").getImages()).hasSize(3);
        assertThat(data.getThemes().get("importTheme")).isNotNull();
        assertThat(data.getThemes().get("importTheme").getImages()).hasSize(2);
    }

    @Test
    void importOperatorThemesEmptyTest() {

        var request = new ThemeSnapshotDTOV1();

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(request)
                .post("operator")
                .then()
                .statusCode(OK.getStatusCode());

        request.setThemes(null);
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(request)
                .post("operator")
                .then()
                .statusCode(OK.getStatusCode());
    }

}


```

## Folder: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/external/v1/controllers (7 files)

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/external/v1/controllers/IconRestControllerV1Test.java

```java

package org.tkit.onecx.theme.rs.external.v1.controllers;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static jakarta.ws.rs.core.Response.Status.*;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import org.junit.jupiter.api.Test;
import org.tkit.onecx.theme.test.AbstractTest;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;
import org.tkit.quarkus.test.WithDBData;

import gen.org.tkit.onecx.theme.rs.icon.v1.model.IconCriteriaDTOV1;
import gen.org.tkit.onecx.theme.rs.icon.v1.model.IconListResponseDTOV1;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@TestHTTPEndpoint(IconRestControllerV1.class)
@WithDBData(value = "data/testdata-external.xml", deleteBeforeInsert = true, deleteAfterTest = true, rinseAndRepeat = true)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-th:read" })
class IconRestControllerV1Test extends AbstractTest {

    @Test
    void retrieveIcons_Test() {

        var iconCriteria = new IconCriteriaDTOV1();
        iconCriteria.getNames().add("prime:icon1");
        iconCriteria.getNames().add("prime:icon2");
        iconCriteria.getNames().add("prime:icon3");
        iconCriteria.getNames().add("prime:icon4");

        var output = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", "cg")
                .when()
                .body(iconCriteria)
                .contentType(APPLICATION_JSON)
                .post()
                .then()
                .statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract().as(IconListResponseDTOV1.class);

        assertThat(output).isNotNull();
        assertThat(3).isEqualTo(output.getIcons().size());
    }

    @Test
    void retrieveIcons_missing_criteria_Test() {

        var iconCriteria = new IconCriteriaDTOV1();
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", "themeName")
                .when()
                .body(iconCriteria)
                .contentType(APPLICATION_JSON)
                .post()
                .then()
                .statusCode(BAD_REQUEST.getStatusCode());
    }
}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/external/v1/controllers/IconRestControllerV1TestIT.java

```java

package org.tkit.onecx.theme.rs.external.v1.controllers;

import io.quarkus.test.junit.QuarkusIntegrationTest;

@QuarkusIntegrationTest
class IconRestControllerV1TestIT extends IconRestControllerV1Test {
}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/external/v1/controllers/ThemesRestControllerV1ExceptionTest.java

```java

package org.tkit.onecx.theme.rs.external.v1.controllers;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static jakarta.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.tkit.onecx.theme.domain.daos.ThemeDAO;
import org.tkit.onecx.theme.test.AbstractTest;
import org.tkit.quarkus.jpa.exceptions.DAOException;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;

import io.quarkus.test.InjectMock;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@TestHTTPEndpoint(ThemesRestControllerV1.class)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-th:read" })
class ThemesRestControllerV1ExceptionTest extends AbstractTest {

    @InjectMock
    ThemeDAO dao;

    @BeforeEach
    void beforeAll() {
        Mockito.when(dao.findAllInfos())
                .thenThrow(new RuntimeException("Test technical error exception"))
                .thenThrow(new DAOException(ThemeDAO.ErrorKeys.ERROR_FIND_THEMES_BY_CRITERIA, new RuntimeException("Test")));
    }

    @Test
    void exceptionTest() {
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .get()
                .then()
                .statusCode(INTERNAL_SERVER_ERROR.getStatusCode());

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .get()
                .then()
                .statusCode(INTERNAL_SERVER_ERROR.getStatusCode());

    }

}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/external/v1/controllers/ThemesRestControllerV1IT.java

```java

package org.tkit.onecx.theme.rs.external.v1.controllers;

import io.quarkus.test.junit.QuarkusIntegrationTest;

@QuarkusIntegrationTest
class ThemesRestControllerV1IT extends ThemesRestControllerV1Test {
}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/external/v1/controllers/ThemesRestControllerV1TenantIT.java

```java

package org.tkit.onecx.theme.rs.external.v1.controllers;

import io.quarkus.test.junit.QuarkusIntegrationTest;

@QuarkusIntegrationTest
class ThemesRestControllerV1TenantIT extends ThemesRestControllerV1Test {
}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/external/v1/controllers/ThemesRestControllerV1TenantTest.java

```java

package org.tkit.onecx.theme.rs.external.v1.controllers;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static jakarta.ws.rs.core.Response.Status.NOT_FOUND;
import static jakarta.ws.rs.core.Response.Status.OK;
import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.tkit.onecx.theme.test.AbstractTest;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;
import org.tkit.quarkus.test.WithDBData;

import gen.org.tkit.onecx.theme.rs.external.v1.model.ThemeDTOV1;
import gen.org.tkit.onecx.theme.rs.external.v1.model.ThemeInfoListDTOV1;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@TestHTTPEndpoint(ThemesRestControllerV1.class)
@WithDBData(value = "data/testdata-external.xml", deleteBeforeInsert = true, deleteAfterTest = true, rinseAndRepeat = true)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-th:read" })
class ThemesRestControllerV1TenantTest extends AbstractTest {

    @Test
    void getThemeByThemeDefinitionNameTest() {
        var dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("name", "themeWithoutPortal")
                .header(APM_HEADER_PARAM, createToken("org1"))
                .get("{name}")
                .then().statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(ThemeDTOV1.class);

        assertThat(dto).isNotNull();
        assertThat(dto.getName()).isEqualTo("themeWithoutPortal");

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org2"))
                .pathParam("name", "themeWithoutPortal")
                .get("{name}")
                .then().statusCode(NOT_FOUND.getStatusCode());
    }

    @Test
    void getThemeInfoListTest() {
        var data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .get()
                .then()
                .statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .as(ThemeInfoListDTOV1.class);

        assertThat(data).isNotNull();
        assertThat(data.getThemes()).isNotNull().hasSize(2);

        data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .get()
                .then()
                .statusCode(OK.getStatusCode())
                .extract()
                .as(ThemeInfoListDTOV1.class);

        assertThat(data).isNotNull();
        assertThat(data.getThemes()).hasSize(3);
    }
}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/external/v1/controllers/ThemesRestControllerV1Test.java

```java

package org.tkit.onecx.theme.rs.external.v1.controllers;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static jakarta.ws.rs.core.Response.Status.NOT_FOUND;
import static jakarta.ws.rs.core.Response.Status.OK;
import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.tkit.onecx.theme.test.AbstractTest;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;
import org.tkit.quarkus.test.WithDBData;

import gen.org.tkit.onecx.theme.rs.external.v1.model.AvailableImageTypesDTOV1;
import gen.org.tkit.onecx.theme.rs.external.v1.model.ThemeDTOV1;
import gen.org.tkit.onecx.theme.rs.external.v1.model.ThemeInfoListDTOV1;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@TestHTTPEndpoint(ThemesRestControllerV1.class)
@WithDBData(value = "data/testdata-external.xml", deleteBeforeInsert = true, deleteAfterTest = true, rinseAndRepeat = true)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-th:read" })
class ThemesRestControllerV1Test extends AbstractTest {

    @Test
    void getThemeByThemeDefinitionNameTest() {
        var dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .get("themeWithoutPortal")
                .then().statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(ThemeDTOV1.class);

        assertThat(dto).isNotNull();
        assertThat(dto.getName()).isEqualTo("themeWithoutPortal");
        assertThat(dto.getOverrides()).hasSize(2);

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .get("none-exists")
                .then().statusCode(NOT_FOUND.getStatusCode());
    }

    @Test
    void getThemeInfoListTest() {
        var data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .get()
                .then()
                .statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .as(ThemeInfoListDTOV1.class);

        assertThat(data).isNotNull();
        assertThat(data.getThemes()).isNotNull().hasSize(3);
    }

    @Test
    void getThemeByThemeFaviconTest() {
        var data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .get("test1/favicon")
                .then()
                .statusCode(OK.getStatusCode())
                .contentType("image/x-icon")
                .extract()
                .body().asByteArray();

        assertThat(data).isNotNull();

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .get("none-exists/favicon")
                .then().statusCode(NOT_FOUND.getStatusCode());
    }

    @Test
    void getThemeByThemeLogoTest() {
        var data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .get("test1/logo")
                .then()
                .statusCode(OK.getStatusCode())
                .contentType("image/png")
                .extract()
                .body().asByteArray();

        assertThat(data).isNotNull();

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .get("none-exists/logo")
                .then().statusCode(NOT_FOUND.getStatusCode());
    }

    @Test
    void getThemeLogoSmallTest() {
        var data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .queryParam("small", true)
                .get("test2/logo")
                .then()
                .statusCode(OK.getStatusCode())
                .contentType("image/png")
                .extract()
                .body().asByteArray();

        assertThat(data).isNotNull();

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .get("none-exists/logo")
                .then().statusCode(NOT_FOUND.getStatusCode());
    }

    @Test
    @SuppressWarnings("java:S5838")
    void getAvailableImageTypes_Test() {
        var output = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("name", "test2")
                .when()
                .get("/{name}/images/availableTypes")
                .then()
                .statusCode(OK.getStatusCode())
                .extract()
                .body().as(AvailableImageTypesDTOV1.class);

        assertThat(output.getTypes().size()).isEqualTo(2);
    }

    @Test
    void getThemeImageByRefIdAndType() {
        var data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("name", "test2")
                .pathParam("refType", "anyString")
                .get("/{name}/images/{refType}")
                .then()
                .statusCode(OK.getStatusCode())
                .contentType("image/png")
                .extract()
                .body().asByteArray();

        assertThat(data).isNotNull();

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("name", "test2")
                .pathParam("refType", "notExisting")
                .get("/{name}/images/{refType}")
                .then()
                .statusCode(NOT_FOUND.getStatusCode());
    }
}


```

## Folder: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/internal/controllers (9 files)

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/internal/controllers/IconRestControllerExceptionTest.java

```java

package org.tkit.onecx.theme.rs.internal.controllers;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static jakarta.ws.rs.core.Response.Status.*;

import java.io.File;
import java.io.IOException;
import java.util.Objects;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.tkit.onecx.theme.domain.services.IconService;
import org.tkit.onecx.theme.test.AbstractTest;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;
import org.tkit.quarkus.test.WithDBData;

import io.quarkus.test.InjectMock;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@TestHTTPEndpoint(IconRestController.class)
@WithDBData(value = "data/testdata-internal.xml", deleteBeforeInsert = true, deleteAfterTest = true, rinseAndRepeat = true)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-th:all", "ocx-th:read", "ocx-th:write", "ocx-th:delete" })
class IconRestControllerExceptionTest extends AbstractTest {
    @InjectMock
    IconService service;

    @BeforeEach
    void beforeAll() throws Exception {
        Mockito.doThrow(new IOException())
                .when(service).createIcons(Mockito.any(byte[].class), Mockito.any(String.class));
    }

    private static final File FILE = new File(
            Objects.requireNonNull(ImageRestControllerTest.class.getResource("/iconsets/mdi-test-iconset.json")).getFile());

    @Test
    void exceptionTest() {
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", "themeName")
                .when()
                .body(FILE)
                .contentType(APPLICATION_JSON)
                .post("/upload")
                .then()
                .statusCode(BAD_REQUEST.getStatusCode());
    }
}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/internal/controllers/IconRestControllerTest.java

```java

package org.tkit.onecx.theme.rs.internal.controllers;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static jakarta.ws.rs.core.Response.Status.*;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import java.io.File;
import java.util.Objects;

import org.junit.jupiter.api.Test;
import org.tkit.onecx.theme.test.AbstractTest;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;
import org.tkit.quarkus.test.WithDBData;

import gen.org.tkit.onecx.theme.rs.icon.internal.model.IconCriteriaDTO;
import gen.org.tkit.onecx.theme.rs.icon.internal.model.IconListResponseDTO;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@TestHTTPEndpoint(IconRestController.class)
@WithDBData(value = "data/testdata-internal.xml", deleteBeforeInsert = true, deleteAfterTest = true, rinseAndRepeat = true)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-th:all", "ocx-th:read", "ocx-th:write", "ocx-th:delete" })
class IconRestControllerTest extends AbstractTest {

    private static final File FILE = new File(
            Objects.requireNonNull(ImageRestControllerTest.class.getResource("/iconsets/mdi-test-iconset.json")).getFile());

    @Test
    void uploadIconSetAndRetrieveIcons_Test() {

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", "themeName")
                .when()
                .body(FILE)
                .contentType(APPLICATION_JSON)
                .post("/upload")
                .then()
                .statusCode(CREATED.getStatusCode());

        //duplicated upload => duplicated key exception
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", "themeName")
                .when()
                .body(FILE)
                .contentType(APPLICATION_JSON)
                .post("/upload")
                .then()
                .statusCode(BAD_REQUEST.getStatusCode());

        var iconCriteria = new IconCriteriaDTO();
        iconCriteria.getNames().add("mdi:ab-testing");
        iconCriteria.getNames().add("mdi:abacus");
        iconCriteria.getNames().add("mdi:car-tyre-warning");
        var output = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", "themeName")
                .when()
                .body(iconCriteria)
                .contentType(APPLICATION_JSON)
                .post()
                .then()
                .statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract().as(IconListResponseDTO.class);

        assertThat(output).isNotNull();
        assertThat(3).isEqualTo(output.getIcons().size());

        //constraint exception, missing criteria
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", "themeName")
                .when()
                .body(new IconCriteriaDTO())
                .contentType(APPLICATION_JSON)
                .post()
                .then()
                .statusCode(BAD_REQUEST.getStatusCode());
    }
}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/internal/controllers/IconRestControllerTestIT.java

```java

package org.tkit.onecx.theme.rs.internal.controllers;

import io.quarkus.test.junit.QuarkusIntegrationTest;

@QuarkusIntegrationTest
class IconRestControllerTestIT extends IconRestControllerTest {
}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/internal/controllers/ImageRestControllerTest.java

```java

package org.tkit.onecx.theme.rs.internal.controllers;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static jakarta.ws.rs.core.Response.Status.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.tkit.onecx.theme.rs.internal.mappers.ExceptionMapper.ErrorKeys.CONSTRAINT_VIOLATIONS;

import java.io.File;
import java.util.Objects;
import java.util.Random;

import jakarta.ws.rs.core.HttpHeaders;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.tkit.onecx.theme.test.AbstractTest;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;
import org.tkit.quarkus.test.WithDBData;

import gen.org.tkit.onecx.image.rs.internal.model.AvailableImageTypesDTO;
import gen.org.tkit.onecx.image.rs.internal.model.ImageInfoDTO;
import gen.org.tkit.onecx.image.rs.internal.model.MimeTypeDTO;
import gen.org.tkit.onecx.image.rs.internal.model.RefTypeDTO;
import gen.org.tkit.onecx.theme.rs.internal.model.ProblemDetailResponseDTO;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@TestHTTPEndpoint(ImageRestController.class)
@WithDBData(value = "data/testdata-internal.xml", deleteBeforeInsert = true, deleteAfterTest = true, rinseAndRepeat = true)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-th:all", "ocx-th:read", "ocx-th:write", "ocx-th:delete" })
class ImageRestControllerTest extends AbstractTest {

    private static final String MEDIA_TYPE_IMAGE_PNG = "image/png";
    private static final String MEDIA_TYPE_IMAGE_JPG = "image/jpg";

    private static final File FILE = new File(
            Objects.requireNonNull(ImageRestControllerTest.class.getResource("/images/Testimage.png")).getFile());

    @Test
    void uploadImage() {
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", "themeName")
                .pathParam("refType", RefTypeDTO.LOGO.toString())
                .header("mimeType", MimeTypeDTO.IMAGE_PNG)
                .when()
                .body(FILE)
                .contentType(MEDIA_TYPE_IMAGE_PNG)
                .post("/{refType}")
                .then()
                .statusCode(CREATED.getStatusCode())
                .extract()
                .body().as(ImageInfoDTO.class);

    }

    @Test
    void uploadImage_anyRefType() {
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", "themeName")
                .pathParam("refType", "ANY_TYPE")
                .header("mimeType", MimeTypeDTO.IMAGE_PNG)
                .when()
                .body(FILE)
                .contentType(MEDIA_TYPE_IMAGE_PNG)
                .post("/{refType}")
                .then()
                .statusCode(CREATED.getStatusCode())
                .extract()
                .body().as(ImageInfoDTO.class);
    }

    @Test
    @SuppressWarnings("java:S5838")
    void getAvailableImageTypes_Test() {
        var output = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", "11-111")
                .when()
                .contentType(MEDIA_TYPE_IMAGE_PNG)
                .get("/availableTypes")
                .then()
                .statusCode(OK.getStatusCode())
                .extract()
                .body().as(AvailableImageTypesDTO.class);

        assertThat(output.getTypes().size()).isEqualTo(2);
    }

    @Test
    void uploadImageEmptyBody() {

        var exception = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", "themeName")
                .pathParam("refType", RefTypeDTO.LOGO.toString())
                .header("mimeType", MimeTypeDTO.IMAGE_PNG)
                .when()
                .contentType(MEDIA_TYPE_IMAGE_PNG)
                .post("/{refType}")
                .then()
                .statusCode(BAD_REQUEST.getStatusCode())
                .extract().as(ProblemDetailResponseDTO.class);

        assertThat(exception.getErrorCode()).isEqualTo(CONSTRAINT_VIOLATIONS.name());
        assertThat(exception.getDetail()).isEqualTo("uploadImage.contentLength: must be greater than or equal to 1");
    }

    @Test
    void uploadImage_shouldReturnBadRequest_whenImageIs() {

        var refId = "themeNameUpload";
        var refType = RefTypeDTO.LOGO;

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", refId)
                .pathParam("refType", refType)
                .header("mimeType", MimeTypeDTO.IMAGE_PNG)
                .when()
                .body(FILE)
                .contentType(MEDIA_TYPE_IMAGE_PNG)
                .post("/{refType}")
                .then()
                .statusCode(CREATED.getStatusCode());
    }

    @Test
    void getImagePngTest() {

        var refId = "themPngTest";
        var refType = RefTypeDTO.FAVICON;

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", refId)
                .pathParam("refType", refType)
                .header("mimeType", MimeTypeDTO.IMAGE_PNG)
                .when()
                .body(FILE)
                .contentType(MEDIA_TYPE_IMAGE_PNG)
                .post("/{refType}")
                .then()
                .statusCode(CREATED.getStatusCode());

        var data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("refId", refId)
                .pathParam("refType", refType)
                .get("/{refType}")
                .then()
                .statusCode(OK.getStatusCode())
                .header(HttpHeaders.CONTENT_TYPE, MEDIA_TYPE_IMAGE_PNG)
                .extract().body().asByteArray();

        assertThat(data).isNotNull().isNotEmpty();
    }

    @Test
    void getImageJpgTest() {

        var refId = "nameJpg";
        var refType = RefTypeDTO.LOGO;

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", refId)
                .pathParam("refType", refType)
                .header("mimeType", MimeTypeDTO.IMAGE_JPG)
                .when()
                .body(FILE)
                .contentType(MEDIA_TYPE_IMAGE_JPG)
                .post("/{refType}")
                .then()
                .statusCode(CREATED.getStatusCode());

        var data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("refId", refId)
                .pathParam("refType", refType)
                .get("/{refType}")
                .then()
                .statusCode(OK.getStatusCode())
                .header(HttpHeaders.CONTENT_TYPE, MEDIA_TYPE_IMAGE_JPG)
                .extract().body().asByteArray();

        assertThat(data).isNotNull().isNotEmpty();
    }

    @Test
    void getImageTest_shouldReturnNotFound_whenImagesDoesNotExist() {

        var refId = "themeNameGetTest";
        var refType = RefTypeDTO.FAVICON;

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", refId)
                .pathParam("refType", refType)
                .header("mimeType", MimeTypeDTO.IMAGE_PNG)
                .when()
                .body(FILE)
                .contentType(MEDIA_TYPE_IMAGE_PNG)
                .post("/{refType}")
                .then()
                .statusCode(CREATED.getStatusCode());

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("refId", refId + "_not_exists")
                .pathParam("refType", refType)
                .get("/{refType}")
                .then()
                .statusCode(NOT_FOUND.getStatusCode());
    }

    @Test
    void updateImage() {

        var refId = "themeUpdateTest";
        var refType = RefTypeDTO.LOGO;

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", refId)
                .pathParam("refType", refType)
                .header("mimeType", MimeTypeDTO.IMAGE_PNG)
                .when()
                .body(FILE)
                .contentType(MEDIA_TYPE_IMAGE_PNG)
                .post("/{refType}")
                .then()
                .statusCode(CREATED.getStatusCode())
                .extract()
                .body().as(ImageInfoDTO.class);

        var res = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", refId)
                .pathParam("refType", refType)
                .header("mimeType", MimeTypeDTO.IMAGE_PNG)
                .when()
                .body(FILE)
                .contentType(MEDIA_TYPE_IMAGE_PNG)
                .post("/{refType}")
                .then()
                .statusCode(CREATED.getStatusCode())
                .extract()
                .body().as(ImageInfoDTO.class);

        Assertions.assertNotNull(res);

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", "does-not-exists")
                .pathParam("refType", refType)
                .header("mimeType", MimeTypeDTO.IMAGE_PNG)
                .when()
                .body(FILE)
                .contentType(MEDIA_TYPE_IMAGE_PNG)
                .post("/{refType}")
                .then()
                .statusCode(CREATED.getStatusCode());
    }

    @Test
    void deleteImage() {

        var refId = "themeDeleteTest";
        var refType = RefTypeDTO.LOGO;

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", refId)
                .pathParam("refType", refType)
                .header("mimeType", MimeTypeDTO.IMAGE_PNG)
                .when()
                .body(FILE)
                .contentType(MEDIA_TYPE_IMAGE_PNG)
                .post("/{refType}")
                .then()
                .statusCode(CREATED.getStatusCode())
                .extract()
                .body().as(ImageInfoDTO.class);

        var res = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", refId)
                .pathParam("refType", refType)
                .when()
                .body(FILE)
                .contentType(MEDIA_TYPE_IMAGE_PNG)
                .delete("/{refType}")
                .then()
                .statusCode(NO_CONTENT.getStatusCode());

        Assertions.assertNotNull(res);

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("refId", refId)
                .pathParam("refType", refType)
                .get("/{refType}")
                .then()
                .statusCode(NOT_FOUND.getStatusCode());
    }

    @Test
    void deleteImagesById() {

        var refId = "themedeleteByIdTest";
        var refType = RefTypeDTO.LOGO;

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", refId)
                .pathParam("refType", refType)
                .header("mimeType", MimeTypeDTO.IMAGE_PNG)
                .when()
                .body(FILE)
                .contentType(MEDIA_TYPE_IMAGE_PNG)
                .post("/{refType}")
                .then()
                .statusCode(CREATED.getStatusCode())
                .extract()
                .body().as(ImageInfoDTO.class);

        var res = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", refId)
                .when()
                .body(FILE)
                .contentType(MEDIA_TYPE_IMAGE_PNG)
                .delete()
                .then()
                .statusCode(NO_CONTENT.getStatusCode());

        Assertions.assertNotNull(res);

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("refId", refId)
                .pathParam("refType", refType)
                .get("/{refType}")
                .then()
                .statusCode(NOT_FOUND.getStatusCode());

    }

    @Test
    void testMaxUploadSize() {

        var refId = "themeMaxUpload";

        byte[] body = new byte[110001];
        new Random().nextBytes(body);

        var exception = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .pathParam("refId", refId)
                .pathParam("refType", RefTypeDTO.LOGO)
                .header("mimeType", MimeTypeDTO.IMAGE_PNG)
                .when()
                .body(body)
                .contentType(MEDIA_TYPE_IMAGE_PNG)
                .post("/{refType}")
                .then()
                .statusCode(BAD_REQUEST.getStatusCode())
                .extract().as(ProblemDetailResponseDTO.class);

        assertThat(exception.getErrorCode()).isEqualTo(CONSTRAINT_VIOLATIONS.name());
        assertThat(exception.getDetail()).isEqualTo(
                "uploadImage.contentLength: must be less than or equal to 110000");

    }
}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/internal/controllers/ImageRestControllerTestIT.java

```java

package org.tkit.onecx.theme.rs.internal.controllers;

import io.quarkus.test.junit.QuarkusIntegrationTest;

@QuarkusIntegrationTest
public class ImageRestControllerTestIT extends ImageRestControllerTest {
}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/internal/controllers/ThemesRestControllerTenantTest.java

```java

package org.tkit.onecx.theme.rs.internal.controllers;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static jakarta.ws.rs.core.Response.Status.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.from;

import jakarta.ws.rs.core.Response;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.tkit.onecx.theme.test.AbstractTest;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;
import org.tkit.quarkus.test.WithDBData;

import gen.org.tkit.onecx.theme.rs.internal.model.*;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@TestHTTPEndpoint(ThemesRestController.class)
@WithDBData(value = "data/testdata-internal.xml", deleteBeforeInsert = true, deleteAfterTest = true, rinseAndRepeat = true)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-th:all", "ocx-th:read", "ocx-th:write", "ocx-th:delete" })
class ThemesRestControllerTenantTest extends AbstractTest {

    @Test
    void createNewThemeTest() {

        // create theme
        var themeDto = new CreateThemeDTO();
        themeDto.setName("test01");
        themeDto.setDisplayName("test01");
        themeDto.setCssFile("cssFile");
        themeDto.setDescription("description");
        themeDto.setAssetsUrl("assets/url");
        themeDto.setPreviewImageUrl("image/url");

        var dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .body(themeDto)
                .post()
                .then()
                .statusCode(CREATED.getStatusCode())
                .extract()
                .body().as(ThemeDTO.class);

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org2"))
                .get(dto.getId())
                .then()
                .statusCode(NOT_FOUND.getStatusCode());

        dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .get(dto.getId())
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .extract()
                .body().as(ThemeDTO.class);

        assertThat(dto).isNotNull()
                .returns(themeDto.getName(), from(ThemeDTO::getName))
                .returns(themeDto.getDescription(), from(ThemeDTO::getDescription))
                .returns(themeDto.getAssetsUrl(), from(ThemeDTO::getAssetsUrl))
                .returns(themeDto.getPreviewImageUrl(), from(ThemeDTO::getPreviewImageUrl));

        // create theme without body
        var exception = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .post()
                .then()
                .statusCode(BAD_REQUEST.getStatusCode())
                .extract().as(ProblemDetailResponseDTO.class);

        assertThat(exception.getErrorCode()).isEqualTo("CONSTRAINT_VIOLATIONS");
        assertThat(exception.getDetail()).isEqualTo("createNewTheme.createThemeDTO: must not be null");

        // create theme with existing name
        themeDto = new CreateThemeDTO();
        themeDto.setName("cg");
        themeDto.setDisplayName("cg_display");

        exception = given()
                .auth().oauth2(getKeycloakClientToken("testClient")).when()
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .body(themeDto)
                .post()
                .then()
                .statusCode(BAD_REQUEST.getStatusCode())
                .extract().as(ProblemDetailResponseDTO.class);

        assertThat(exception.getErrorCode()).isEqualTo("PERSIST_ENTITY_FAILED");
        assertThat(exception.getDetail()).isEqualTo(
                "could not execute statement [ERROR: duplicate key value violates unique constraint 'theme_name'  Detail: Key (name, tenant_id)=(cg, tenant-100) already exists.]");
    }

    @Test
    void deleteThemeTest() {

        // delete entity with wrong tenant
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .delete("t-DELETE_1")
                .then().statusCode(NO_CONTENT.getStatusCode());

        // delete entity with wrong tenant still exists
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org2"))
                .get("t-DELETE_1")
                .then().statusCode(OK.getStatusCode());

        // delete theme
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org2"))
                .delete("t-DELETE_1")
                .then().statusCode(NO_CONTENT.getStatusCode());

        // check if theme exists
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org2"))
                .get("t-DELETE_1")
                .then().statusCode(NOT_FOUND.getStatusCode());

        // delete theme in portal
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org2"))
                .delete("t-11-111")
                .then()
                .statusCode(NO_CONTENT.getStatusCode());

    }

    @Test
    void getThemeByThemeDefinitionNameTest() {
        var dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .pathParam("name", "themeWithoutPortal")
                .get("/name/{name}")
                .then().statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(ThemeDTO.class);

        assertThat(dto).isNotNull();
        assertThat(dto.getName()).isEqualTo("themeWithoutPortal");
        assertThat(dto.getId()).isEqualTo("t-22-222");

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org2"))
                .pathParam("name", "themeWithoutPortal")
                .get("/name/{name}")
                .then().statusCode(NOT_FOUND.getStatusCode());
    }

    @Test
    void getThemeByIdTest() {

        var dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .get("t-22-222")
                .then().statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(ThemeDTO.class);

        assertThat(dto).isNotNull();
        assertThat(dto.getName()).isEqualTo("themeWithoutPortal");
        assertThat(dto.getId()).isEqualTo("t-22-222");

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .get("t-22-222")
                .then().statusCode(NOT_FOUND.getStatusCode());

        dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .get("t-11-111")
                .then().statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(ThemeDTO.class);

        assertThat(dto).isNotNull();
        assertThat(dto.getName()).isEqualTo("cg");
        assertThat(dto.getId()).isEqualTo("t-11-111");

    }

    @Test
    void searchThemesTest() {
        var criteria = new ThemeSearchCriteriaDTO();

        var data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .body(criteria)
                .post("/search")
                .then()
                .statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .as(ThemePageResultDTO.class);

        assertThat(data).isNotNull();
        assertThat(data.getTotalElements()).isEqualTo(2);
        assertThat(data.getStream()).isNotNull().hasSize(2);

        criteria.setName(" ");
        data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .body(criteria)
                .post("/search")
                .then()
                .statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .as(ThemePageResultDTO.class);

        assertThat(data).isNotNull();
        assertThat(data.getTotalElements()).isEqualTo(2);
        assertThat(data.getStream()).isNotNull().hasSize(2);

        criteria.setName("cg");
        data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .body(criteria)
                .post("/search")
                .then()
                .statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .as(ThemePageResultDTO.class);

        assertThat(data).isNotNull();
        assertThat(data.getTotalElements()).isEqualTo(1);
        assertThat(data.getStream()).isNotNull().hasSize(1);

    }

    @Test
    void getThemeInfoListTest() {
        var data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org2"))
                .get("info")
                .then()
                .statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .as(ThemeInfoListDTO.class);

        assertThat(data).isNotNull();
        assertThat(data.getThemes()).isNotNull().hasSize(1);
    }

    @Test
    void updateThemeTest() {

        // update none existing theme
        var themeDto = new UpdateThemeDTO();
        themeDto.setName("test01");
        themeDto.setDisplayName("test01");
        themeDto.setModificationCount(0);
        themeDto.setDescription("description-update");

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org2"))
                .body(themeDto)
                .when()
                .put("t-11-111")
                .then().statusCode(NOT_FOUND.getStatusCode());

        // update theme
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .body(themeDto)
                .when()
                .put("t-11-111")
                .then().statusCode(NO_CONTENT.getStatusCode());

        // download theme
        var dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient")).contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .body(themeDto)
                .when()
                .get("t-11-111")
                .then().statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(ThemeDTO.class);

        assertThat(dto).isNotNull();
        assertThat(dto.getDescription()).isEqualTo(themeDto.getDescription());

    }

    @Test
    void updateThemeWithExistingNameTest() {

        var themeDto = new UpdateThemeDTO();
        themeDto.setName("themeWithoutPortal");
        themeDto.setDisplayName("themeWithoutPortal");
        themeDto.setModificationCount(0);
        themeDto.setDescription("description");

        var exception = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org1"))
                .when()
                .body(themeDto)
                .put("t-11-111")
                .then()
                .statusCode(BAD_REQUEST.getStatusCode())
                .extract().as(ProblemDetailResponseDTO.class);

        Assertions.assertNotNull(exception);
        Assertions.assertEquals("MERGE_ENTITY_FAILED", exception.getErrorCode());
        Assertions.assertEquals(
                "could not execute statement [ERROR: duplicate key value violates unique constraint 'theme_name'  Detail: Key (name, tenant_id)=(themeWithoutPortal, tenant-100) already exists.]",
                exception.getDetail());
        Assertions.assertNotNull(exception.getInvalidParams());
        Assertions.assertTrue(exception.getInvalidParams().isEmpty());

    }

    @Test
    void updateThemeWithoutBodyTest() {

        var exception = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .header(APM_HEADER_PARAM, createToken("org2"))
                .when()
                .put("update_create_new")
                .then()
                .statusCode(BAD_REQUEST.getStatusCode())
                .extract().as(ProblemDetailResponseDTO.class);

        Assertions.assertNotNull(exception);
        Assertions.assertEquals("CONSTRAINT_VIOLATIONS", exception.getErrorCode());
        Assertions.assertEquals("updateTheme.updateThemeDTO: must not be null",
                exception.getDetail());
        Assertions.assertNotNull(exception.getInvalidParams());
        Assertions.assertEquals(1, exception.getInvalidParams().size());
    }

}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/internal/controllers/ThemesRestControllerTenantTestIT.java

```java

package org.tkit.onecx.theme.rs.internal.controllers;

import io.quarkus.test.junit.QuarkusIntegrationTest;

@QuarkusIntegrationTest
class ThemesRestControllerTenantTestIT extends ThemesRestControllerTenantTest {
}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/internal/controllers/ThemesRestControllerTest.java

```java

package org.tkit.onecx.theme.rs.internal.controllers;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static jakarta.ws.rs.core.Response.Status.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.from;

import java.util.List;

import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.tkit.onecx.theme.test.AbstractTest;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;
import org.tkit.quarkus.test.WithDBData;

import gen.org.tkit.onecx.theme.rs.internal.model.*;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@TestHTTPEndpoint(ThemesRestController.class)
@WithDBData(value = "data/testdata-internal.xml", deleteBeforeInsert = true, deleteAfterTest = true, rinseAndRepeat = true)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-th:all", "ocx-th:read", "ocx-th:write", "ocx-th:delete" })
class ThemesRestControllerTest extends AbstractTest {

    @Test
    void createNewThemeTest() {

        // create theme
        var themeDto = new CreateThemeDTO();
        var overrideDto = new ThemeOverrideDTO();
        overrideDto.setType(OverrideTypeDTO.CSS);
        overrideDto.setValue(".class { color: red; }");
        themeDto.setName("test01");
        themeDto.setDisplayName("test01");
        themeDto.setCssFile("cssFile");
        themeDto.setDescription("description");
        themeDto.setAssetsUrl("assets/url");
        themeDto.setPreviewImageUrl("image/url");
        themeDto.setOverrides(List.of(overrideDto));

        var uri = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(themeDto)
                .post()
                .then().statusCode(CREATED.getStatusCode())
                .extract().header(HttpHeaders.LOCATION);

        var dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .get(uri)
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .extract()
                .body().as(ThemeDTO.class);

        assertThat(dto).isNotNull()
                .returns(themeDto.getName(), from(ThemeDTO::getName))
                .returns(themeDto.getDescription(), from(ThemeDTO::getDescription))
                .returns(themeDto.getAssetsUrl(), from(ThemeDTO::getAssetsUrl))
                .returns(themeDto.getPreviewImageUrl(), from(ThemeDTO::getPreviewImageUrl));

        // create theme without body
        var exception = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .post()
                .then()
                .statusCode(BAD_REQUEST.getStatusCode())
                .extract().as(ProblemDetailResponseDTO.class);

        assertThat(exception.getErrorCode()).isEqualTo("CONSTRAINT_VIOLATIONS");
        assertThat(exception.getDetail()).isEqualTo("createNewTheme.createThemeDTO: must not be null");

        // create theme with existing name
        themeDto = new CreateThemeDTO();
        themeDto.setName("cg");
        themeDto.setDisplayName("cg-display");

        exception = given()
                .auth().oauth2(getKeycloakClientToken("testClient")).when()
                .contentType(APPLICATION_JSON)
                .body(themeDto)
                .post()
                .then()
                .statusCode(BAD_REQUEST.getStatusCode())
                .extract().as(ProblemDetailResponseDTO.class);

        assertThat(exception.getErrorCode()).isEqualTo("PERSIST_ENTITY_FAILED");
        assertThat(exception.getDetail()).isEqualTo(
                "could not execute statement [ERROR: duplicate key value violates unique constraint 'theme_name'  Detail: Key (name, tenant_id)=(cg, default) already exists.]");
    }

    @Test
    void delete_mandatory_theme_not_possible() {
        // create theme
        var themeDto = new CreateThemeDTO();
        themeDto.setName("test01");
        themeDto.setDisplayName("test01");
        themeDto.setCssFile("cssFile");
        themeDto.setDescription("description");
        themeDto.setAssetsUrl("assets/url");
        themeDto.setPreviewImageUrl("image/url");
        themeDto.setMandatory(true);

        var uri = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .when()
                .contentType(APPLICATION_JSON)
                .body(themeDto)
                .post()
                .then().statusCode(CREATED.getStatusCode())
                .extract().header(HttpHeaders.LOCATION);

        var dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .get(uri)
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .extract()
                .body().as(ThemeDTO.class);

        // delete theme
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("id", dto.getId())
                .delete("{id}")
                .then().statusCode(NO_CONTENT.getStatusCode());

        // check if theme still exists
        dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("id", dto.getId())
                .get("{id}")
                .then().statusCode(OK.getStatusCode())
                .extract().as(ThemeDTO.class);

        // update theme, set mandatory to false
        var themeUpdateDto = new UpdateThemeDTO();
        themeUpdateDto.setName("test01");
        themeUpdateDto.setDisplayName("test01");
        themeUpdateDto.setModificationCount(dto.getModificationCount());
        themeUpdateDto.setDescription("description-update");
        themeUpdateDto.setMandatory(false);

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .body(themeUpdateDto)
                .when()
                .pathParam("id", dto.getId())
                .put("{id}")
                .then().statusCode(NO_CONTENT.getStatusCode());

        // try to delete theme again
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("id", dto.getId())
                .delete("{id}")
                .then().statusCode(NO_CONTENT.getStatusCode());

        // check if theme doesn't exist anymore
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("id", dto.getId())
                .get("{id}")
                .then().statusCode(NOT_FOUND.getStatusCode());
    }

    @Test
    void deleteThemeTest() {

        // delete theme
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("id", "DELETE_1")
                .delete("{id}")
                .then().statusCode(NO_CONTENT.getStatusCode());

        // check if theme exists
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("id", "DELETE_1")
                .get("{id}")
                .then().statusCode(NOT_FOUND.getStatusCode());

        // delete theme in portal
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("id", "11-111")
                .delete("{id}")
                .then()
                .statusCode(NO_CONTENT.getStatusCode());

    }

    @Test
    void getThemeByThemeDefinitionNameTest() {
        var dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("name", "themeWithoutPortal")
                .get("/name/{name}")
                .then()
                .statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(ThemeDTO.class);

        assertThat(dto).isNotNull();
        assertThat(dto.getName()).isEqualTo("themeWithoutPortal");
        assertThat(dto.getId()).isEqualTo("22-222");

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("name", "none-exists")
                .get("/name/{name}")
                .then().statusCode(NOT_FOUND.getStatusCode());
    }

    @Test
    void getThemeByIdTest() {

        var dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("id", "22-222")
                .get("{id}")
                .then().statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(ThemeDTO.class);

        assertThat(dto).isNotNull();
        assertThat(dto.getName()).isEqualTo("themeWithoutPortal");
        assertThat(dto.getId()).isEqualTo("22-222");
        assertThat(dto.getOverrides().get(0).getValue()).isNotNull();

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("id", "___")
                .get("{id}")
                .then().statusCode(NOT_FOUND.getStatusCode());

        dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .pathParam("id", "11-111")
                .get("{id}")
                .then().statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(ThemeDTO.class);

        assertThat(dto).isNotNull();
        assertThat(dto.getName()).isEqualTo("cg");
        assertThat(dto.getId()).isEqualTo("11-111");

    }

    @Test
    void searchThemesTest() {
        var criteria = new ThemeSearchCriteriaDTO();

        var data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .body(criteria)
                .post("/search")
                .then()
                .statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .as(ThemePageResultDTO.class);

        assertThat(data).isNotNull();
        assertThat(data.getTotalElements()).isEqualTo(3);
        assertThat(data.getStream()).isNotNull().hasSize(3);

        criteria.setName(" ");
        data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .body(criteria)
                .post("/search")
                .then()
                .statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .as(ThemePageResultDTO.class);

        assertThat(data).isNotNull();
        assertThat(data.getTotalElements()).isEqualTo(3);
        assertThat(data.getStream()).isNotNull().hasSize(3);

        criteria.setName("cg");
        data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .body(criteria)
                .post("/search")
                .then()
                .statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .as(ThemePageResultDTO.class);

        assertThat(data).isNotNull();
        assertThat(data.getTotalElements()).isEqualTo(1);
        assertThat(data.getStream()).isNotNull().hasSize(1);

    }

    @Test
    void getThemeInfoListTest() {
        var data = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .get("info")
                .then()
                .statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .as(ThemeInfoListDTO.class);

        assertThat(data).isNotNull();
        assertThat(data.getThemes()).isNotNull().hasSize(3);
    }

    @Test
    void updateThemeTest() {

        // update none existing theme
        var themeDto = new UpdateThemeDTO();
        var overrideDto = new ThemeOverrideDTO();
        overrideDto.setType(OverrideTypeDTO.CSS);
        overrideDto.setValue(".class { color: blue; }");
        themeDto.setName("test01");
        themeDto.setDisplayName("test01");
        themeDto.setModificationCount(0);
        themeDto.setDescription("description-update");
        themeDto.setOverrides(List.of(overrideDto));

        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .body(themeDto)
                .when()
                .pathParam("id", "does-not-exists")
                .put("{id}")
                .then().statusCode(NOT_FOUND.getStatusCode());

        // update theme
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .body(themeDto)
                .when()
                .pathParam("id", "11-111")
                .put("{id}")
                .then().statusCode(NO_CONTENT.getStatusCode());

        // download theme
        var dto = given()
                .auth().oauth2(getKeycloakClientToken("testClient")).contentType(APPLICATION_JSON)
                .body(themeDto)
                .when()
                .pathParam("id", "11-111")
                .get("{id}")
                .then().statusCode(OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(ThemeDTO.class);
        assertThat(dto.getOverrides().get(0).getValue()).isEqualTo(overrideDto.getValue());

        // update theme with wrong modificationCount
        given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .body(themeDto)
                .when()
                .pathParam("id", "11-111")
                .put("{id}")
                .then().statusCode(BAD_REQUEST.getStatusCode());

        assertThat(dto).isNotNull();
        assertThat(dto.getDescription()).isEqualTo(themeDto.getDescription());

    }

    @Test
    void updateThemeWithExistingNameTest() {

        var themeDto = new UpdateThemeDTO();
        themeDto.setName("themeWithoutPortal");
        themeDto.setDisplayName("themeWithoutPortal");
        themeDto.setModificationCount(0);
        themeDto.setDescription("description");

        var exception = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .when()
                .body(themeDto)
                .pathParam("id", "11-111")
                .put("{id}")
                .then()
                .statusCode(BAD_REQUEST.getStatusCode())
                .extract().as(ProblemDetailResponseDTO.class);

        Assertions.assertNotNull(exception);
        Assertions.assertEquals("MERGE_ENTITY_FAILED", exception.getErrorCode());
        Assertions.assertEquals(
                "could not execute statement [ERROR: duplicate key value violates unique constraint 'theme_name'  Detail: Key (name, tenant_id)=(themeWithoutPortal, default) already exists.]",
                exception.getDetail());
        Assertions.assertNotNull(exception.getInvalidParams());
        Assertions.assertTrue(exception.getInvalidParams().isEmpty());
    }

    @Test
    void updateThemeWithoutBodyTest() {

        var exception = given()
                .auth().oauth2(getKeycloakClientToken("testClient"))
                .contentType(APPLICATION_JSON)
                .when()
                .pathParam("id", "update_create_new")
                .put("{id}")
                .then()
                .statusCode(BAD_REQUEST.getStatusCode())
                .extract().as(ProblemDetailResponseDTO.class);

        Assertions.assertNotNull(exception);
        Assertions.assertEquals("CONSTRAINT_VIOLATIONS", exception.getErrorCode());
        Assertions.assertEquals("updateTheme.updateThemeDTO: must not be null",
                exception.getDetail());
        Assertions.assertNotNull(exception.getInvalidParams());
        Assertions.assertEquals(1, exception.getInvalidParams().size());
    }
}


```

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/rs/internal/controllers/ThemesRestControllerTestIT.java

```java

package org.tkit.onecx.theme.rs.internal.controllers;

import io.quarkus.test.junit.QuarkusIntegrationTest;

@QuarkusIntegrationTest
class ThemesRestControllerTestIT extends ThemesRestControllerTest {
}


```

## Folder: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/test (1 files)

### File: onecx-theme-svc/src/test/java/org/tkit/onecx/theme/test/AbstractTest.java

```java

package org.tkit.onecx.theme.test;

import static com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS;
import static io.restassured.RestAssured.config;
import static io.restassured.config.ObjectMapperConfig.objectMapperConfig;

import java.security.PrivateKey;

import jakarta.json.Json;
import jakarta.json.JsonObjectBuilder;

import org.eclipse.microprofile.config.ConfigProvider;
import org.eclipse.microprofile.jwt.Claims;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import io.quarkus.test.keycloak.client.KeycloakTestClient;
import io.restassured.config.RestAssuredConfig;
import io.smallrye.jwt.build.Jwt;
import io.smallrye.jwt.util.KeyUtils;

@SuppressWarnings("java:S2187")
public class AbstractTest {

    protected static final String APM_HEADER_PARAM = "apm-principal-token";
    protected static final String CLAIMS_ORG_ID = ConfigProvider.getConfig()
            .getValue("%test.tkit.rs.context.tenant-id.mock.claim-org-id", String.class);

    KeycloakTestClient keycloakClient = new KeycloakTestClient();

    static {
        config = RestAssuredConfig.config().objectMapperConfig(
                objectMapperConfig().jackson2ObjectMapperFactory(
                        (cls, charset) -> {
                            var objectMapper = new ObjectMapper();
                            objectMapper.registerModule(new JavaTimeModule());
                            objectMapper.configure(WRITE_DATES_AS_TIMESTAMPS, false);
                            return objectMapper;
                        }));
    }

    protected String getKeycloakClientToken(String clientId) {
        return keycloakClient.getClientAccessToken(clientId);
    }

    protected static String createToken(String organizationId) {
        try {
            String userName = "test-user";
            JsonObjectBuilder claims = Json.createObjectBuilder();
            claims.add(Claims.preferred_username.name(), userName);
            claims.add(Claims.sub.name(), userName);
            claims.add(CLAIMS_ORG_ID, organizationId);
            PrivateKey privateKey = KeyUtils.generateKeyPair(2048).getPrivate();
            return Jwt.claims(claims.build()).sign(privateKey);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

}


```

## Folder: onecx-theme-svc/src/test/resources/data (4 files)

### File: onecx-theme-svc/src/test/resources/data/testdata-admin.xml

```xml

<?xml version="1.0" encoding="UTF-8"?>
<dataset>

    <!-- THEME -->
    <THEME guid="11-111" optlock="0" name="cg" tenant_id="default" />
    <THEME guid="22-222" optlock="0" name="themeWithoutPortal" tenant_id="default" />
    <THEME guid="DELETE_1" optlock="0" name="toDelete" tenant_id="default" />

    <THEME guid="t-11-111" optlock="0" name="cg" tenant_id="tenant-100" />
    <THEME guid="t-22-222" optlock="0" name="themeWithoutPortal" tenant_id="tenant-100" />
    <THEME guid="t-DELETE_1" optlock="0" name="toDelete" tenant_id="tenant-200" />

    <!-- THEME OVERRIDES -->
    <THEME_OVERRIDE guid="ovr-1" theme_id="11-111" type="CSS" value="{&quot;colors&quot;:{&quot;primary&quot;:&quot;#FF0000&quot;,&quot;secondary&quot;:&quot;#00FF00&quot;}}"/>
    <THEME_OVERRIDE guid="ovr-2" theme_id="11-111" type="PRIMENG" value="{&quot;colors&quot;:{&quot;primary&quot;:&quot;#FF0000&quot;,&quot;secondary&quot;:&quot;#00FF00&quot;}}"/>
    <THEME_OVERRIDE guid="ovr-3" theme_id="22-222" type="PRIMENG" value="{&quot;colors&quot;:{&quot;primary&quot;:&quot;#FF0000&quot;,&quot;secondary&quot;:&quot;#00FF00&quot;}}"/>
    <THEME_OVERRIDE guid="ovr-4" theme_id="DELETE_1" type="PRIMENG" value="{&quot;colors&quot;:{&quot;primary&quot;:&quot;#FF0000&quot;,&quot;secondary&quot;:&quot;#00FF00&quot;}}"/>

</dataset>


```

### File: onecx-theme-svc/src/test/resources/data/testdata-exim.xml

```xml

<?xml version="1.0" encoding="UTF-8"?>
<dataset>

	<!-- THEME -->
	<THEME guid="11-111" optlock="0" name="cg" tenant_id="default" />
	<THEME guid="22-222" optlock="0" name="themeWithoutPortal" tenant_id="default" />
	<THEME guid="DELETE_1" optlock="0" name="toDelete" tenant_id="default" />

	<THEME guid="t-11-111" optlock="0" name="cg" tenant_id="tenant-100" />
	<THEME guid="t-22-222" optlock="0" name="themeWithoutPortal" tenant_id="tenant-100" />
	<THEME guid="t-DELETE_1" optlock="0" name="toDelete" tenant_id="tenant-200" />

	<IMAGE guid="i1" optlock="0" mime_type="image/x-icon" data_length="3" data="123456667890123456" ref_type="favicon" ref_id="cg" tenant_id="default" />
	<IMAGE guid="i3" optlock="0" mime_type="image/png" data_length="3" data="123456667890123456" ref_type="logo" ref_id="cg" tenant_id="default" />

	<IMAGE guid="i2" optlock="0" mime_type="image/x-icon" data_length="3" data="123456667890123456" ref_type="favicon" ref_id="cg" tenant_id="tenant-100" />
	<IMAGE guid="i4" optlock="0" mime_type="image/png" data_length="3" data="123456667890123456" ref_type="logo" ref_id="cg" tenant_id="tenant-100" />

	<!-- THEME OVERRIDES -->
	<THEME_OVERRIDE guid="ovr-1" theme_id="11-111" type="CSS" value="{&quot;colors&quot;:{&quot;primary&quot;:&quot;#FF0000&quot;,&quot;secondary&quot;:&quot;#00FF00&quot;}}"/>
	<THEME_OVERRIDE guid="ovr-2" theme_id="11-111" type="PRIMENG" value="{&quot;colors&quot;:{&quot;primary&quot;:&quot;#FF0000&quot;,&quot;secondary&quot;:&quot;#00FF00&quot;}}"/>
	<THEME_OVERRIDE guid="ovr-3" theme_id="22-222" type="PRIMENG" value="{&quot;colors&quot;:{&quot;primary&quot;:&quot;#FF0000&quot;,&quot;secondary&quot;:&quot;#00FF00&quot;}}"/>
	<THEME_OVERRIDE guid="ovr-4" theme_id="DELETE_1" type="PRIMENG" value="{&quot;colors&quot;:{&quot;primary&quot;:&quot;#FF0000&quot;,&quot;secondary&quot;:&quot;#00FF00&quot;}}"/>

</dataset>


```

### File: onecx-theme-svc/src/test/resources/data/testdata-external.xml

```xml

<?xml version="1.0" encoding="UTF-8"?>
<dataset>

	<!-- THEME -->
	<THEME guid="11-111" optlock="0" name="cg" tenant_id="default" />
	<THEME guid="22-222" optlock="0" name="themeWithoutPortal" tenant_id="default" />
	<THEME guid="DELETE_1" optlock="0" name="toDelete" tenant_id="default" />

	<THEME guid="t-11-111" optlock="0" name="cg" tenant_id="tenant-100" />
	<THEME guid="t-22-222" optlock="0" name="themeWithoutPortal" tenant_id="tenant-100" />
	<THEME guid="t-DELETE_1" optlock="0" name="toDelete" tenant_id="tenant-200" />


	<IMAGE guid="i1" optlock="0" mime_type="image/x-icon" data_length="3" data="123456667890123456" ref_type="favicon" ref_id="test1" tenant_id="default" />
	<IMAGE guid="i2" optlock="0" mime_type="image/x-icon" data_length="3" data="123456667890123456" ref_type="favicon" ref_id="test1" tenant_id="tenant-100" />
	<IMAGE guid="i3" optlock="0" mime_type="image/png" data_length="3" data="123456667890123456" ref_type="logo" ref_id="test1" tenant_id="default" />
	<IMAGE guid="i4" optlock="0" mime_type="image/png" data_length="3" data="123456667890123456" ref_type="logo" ref_id="test1" tenant_id="tenant-100" />
	<IMAGE guid="i5" optlock="0" mime_type="image/png" data_length="3" data="123456667890123456" ref_type="logo-small" ref_id="test2" tenant_id="default" />
	<IMAGE guid="i6" optlock="0" mime_type="image/png" data_length="3" data="123456667890123456" ref_type="anyString" ref_id="test2" tenant_id="default" />

	<!-- THEME OVERRIDES -->
	<THEME_OVERRIDE guid="ovr-1" theme_id="11-111" type="CSS" value="{&quot;colors&quot;:{&quot;primary&quot;:&quot;#FF0000&quot;,&quot;secondary&quot;:&quot;#00FF00&quot;}}"/>
	<THEME_OVERRIDE guid="ovr-2" theme_id="11-111" type="PRIMENG" value="{&quot;colors&quot;:{&quot;primary&quot;:&quot;#FF0000&quot;,&quot;secondary&quot;:&quot;#00FF00&quot;}}"/>
	<THEME_OVERRIDE guid="ovr-3" theme_id="22-222" type="CSS" value="{&quot;colors&quot;:{&quot;primary&quot;:&quot;#FF0000&quot;,&quot;secondary&quot;:&quot;#00FF00&quot;}}"/>
	<THEME_OVERRIDE guid="ovr-4" theme_id="22-222" type="PRIMENG" value="{&quot;colors&quot;:{&quot;primary&quot;:&quot;#FF0000&quot;,&quot;secondary&quot;:&quot;#00FF00&quot;}}"/>
	<THEME_OVERRIDE guid="ovr-5" theme_id="DELETE_1" type="PRIMENG" value="{&quot;colors&quot;:{&quot;primary&quot;:&quot;#FF0000&quot;,&quot;secondary&quot;:&quot;#00FF00&quot;}}"/>

	<!-- ICONS -->
	<ICON guid="icon-1" optlock="0" name="prime:icon1" ref_id="cg" type="SVG" tenant_id="default" body="xx" />
	<ICON guid="icon-2" optlock="0" name="prime:icon2" ref_id="cg" type="SVG" tenant_id="default" body="xx" />
	<ICON guid="icon-3" optlock="0" name="prime:icon3" parent="prime:icon1" ref_id="cg" type="SVG" tenant_id="default"/>
	<ICON guid="icon-4" optlock="0" name="prime:icon4" parent="prime:notExisting" ref_id="cg" type="SVG" tenant_id="default"/>

</dataset>


```

### File: onecx-theme-svc/src/test/resources/data/testdata-internal.xml

```xml

<?xml version="1.0" encoding="UTF-8"?>
<dataset>

	<!-- THEME -->
	<THEME guid="11-111" optlock="0" name="cg" tenant_id="default" />
	<THEME guid="22-222" optlock="0" name="themeWithoutPortal" tenant_id="default" />
	<THEME guid="DELETE_1" optlock="0" name="toDelete" tenant_id="default" />

	<THEME guid="t-11-111" optlock="0" name="cg" tenant_id="tenant-100" />
	<THEME guid="t-22-222" optlock="0" name="themeWithoutPortal" tenant_id="tenant-100" />
	<THEME guid="t-DELETE_1" optlock="0" name="toDelete" tenant_id="tenant-200" />
	<!-- IMAGES -->
	<IMAGE guid="i1" optlock="0" mime_type="image/png" data_length="3" data="123456667890123456" ref_type="favicon" ref_id="11-111" tenant_id="default" />
	<IMAGE guid="i2" optlock="0" mime_type="image/png" data_length="3" data="123456667890123456" ref_type="anyString" ref_id="11-111" tenant_id="default" />

	<!-- THEME OVERRIDES -->
	<THEME_OVERRIDE guid="ovr-1" theme_id="11-111" type="CSS" value="{&quot;colors&quot;:{&quot;primary&quot;:&quot;#FF0000&quot;,&quot;secondary&quot;:&quot;#00FF00&quot;}}"/>
	<THEME_OVERRIDE guid="ovr-2" theme_id="11-111" type="PRIMENG" value="{&quot;colors&quot;:{&quot;primary&quot;:&quot;#FF0000&quot;,&quot;secondary&quot;:&quot;#00FF00&quot;}}"/>
	<THEME_OVERRIDE guid="ovr-3" theme_id="22-222" type="PRIMENG" value="{&quot;colors&quot;:{&quot;primary&quot;:&quot;#FF0000&quot;,&quot;secondary&quot;:&quot;#00FF00&quot;}}"/>
	<THEME_OVERRIDE guid="ovr-4" theme_id="DELETE_1" type="PRIMENG" value="{&quot;colors&quot;:{&quot;primary&quot;:&quot;#FF0000&quot;,&quot;secondary&quot;:&quot;#00FF00&quot;}}"/>

</dataset>


```

## Folder: onecx-theme-svc/src/test/resources/iconsets (1 files)

### File: onecx-theme-svc/src/test/resources/iconsets/mdi-test-iconset.json

```json

{
  "prefix": "mdi",
  "info": {
    "name": "Material Design Icons",
    "total": 3,
    "author": {
      "name": "Pictogrammers",
      "url": "https://github.com/Templarian/MaterialDesign"
    },
    "license": {
      "title": "Apache 2.0",
      "spdx": "Apache-2.0",
      "url": "https://github.com/Templarian/MaterialDesign/blob/master/LICENSE"
    }
  },
  "icons": {
    "ab-testing": {
      "body": "<path fill=\"currentColor\" d=\"M4 2a2 2 0 0 0-2 2v8h2V8h2v4h2V4a2 2 0 0 0-2-2zm0 2h2v2H4m18 9.5V14a2 2 0 0 0-2-2h-4v10h4a2 2 0 0 0 2-2v-1.5a1.54 1.54 0 0 0-1.5-1.5a1.54 1.54 0 0 0 1.5-1.5M20 20h-2v-2h2zm0-4h-2v-2h2M5.79 21.61l-1.58-1.22l14-18l1.58 1.22Z\"/>"
    },
    "abacus": {
      "body": "<path fill=\"currentColor\" d=\"M5 5h2v6H5zm5 0H8v6h2zM5 19h2v-6H5zm5-6H8v6h2v-2h5v-2h-5zm-8 8h2V3H2zM20 3v4h-7V5h-2v6h2V9h7v6h-2v-2h-2v6h2v-2h2v4h2V3z\"/>"
    },
    "car-tire-alert": {
      "body": "<path fill=\"currentColor\" d=\"M11 13h2v2h-2zm0-8h2v6h-2zm6-.24c1.86 1.43 3 3.85 3 6.24a8 8 0 0 1-4.14 7H8.14A8 8 0 0 1 4 11c0-2.39 1.09-4.83 3-6.24V2H5v1.86C3.15 5.68 2 8.2 2 11s1.15 5.32 3 7.14V22h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-3.86c1.85-1.82 3-4.34 3-7.14s-1.15-5.32-3-7.14V2h-2z\"/>"
    }
  },
  "aliases": {
    "car-tyre-alert": {
      "parent": "car-tire-alert"
    },
    "car-tyre-warning": {
      "parent": "car-tyre-alert"
    }
  }
}


```

## Folder: onecx-theme-svc/src/test/resources/import (1 files)

### File: onecx-theme-svc/src/test/resources/import/theme-import.json

```json

{
  "themes": {
    "Theme1": {
      "displayName": "Theme 1",
      "description": "Theme1 basic color scheme",
      "properties": {
        "topbar": {
          "topbar-bg-color": " rgb(18, 171, 219)",
          "topbar-item-text-color": " #ffffff",
          "topbar-text-color": " #ffffff",
          "topbar-left-bg-color": " #ececec",
          "topbar-item-text-hover-bg-color": " rgba(255, 255, 255, 0.12)",
          "topbar-menu-button-bg-color": " rgb(255, 0, 68)",
          "logo-color": " rgb(18, 171, 219)",
          "danger-button-bg": "#D32F2F",
          "info-message-bg": "#b3e5fc",
          "success-message-bg": "#c8e6c9",
          "warning-message-bg": "#ffecb3",
          "error-message-bg": "#ffcdd2"
        },
        "general": {
          "text-color": " rgba(0, 0, 0, 0.87)",
          "text-secondary-color": " rgba(0, 0, 0, 0.6)",
          "primary-color": " rgb(18, 171, 219)",
          "secondary-color": " #ee4400",
          "body-bg-color": " #f7f7f7",
          "content-bg-color": " #ffffff",
          "content-alt-bg-color": "",
          "overlay-content-bg-color": " #ffffff",
          "hover-bg-color": " rgba(0, 0, 0, 0.04)",
          "solid-surface-text-color": " #ffffff",
          "divider-color": " #e4e4e4"
        },
        "sidebar": {
          "menu-text-color": " #657380",
          "menu-bg-color": " #fdfeff",
          "menu-item-text-color": " #515c66",
          "menu-item-hover-bg-color": " rgba(0, 0, 0, 0.04)",
          "inline-menu-border-color": " #e4e4e4"
        }
      },
      "images" : {
        "logo": {
          "imageData": "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",
          "mimeType": "image/*"
        },
        "favicon": {
          "imageData": "AAABAAMAMDAAAAEAIACoJQAANgAAACAgAAABACAAqBAAAN4lAAAQEAAAAQAgAGgEAACGNgAAKAAAADAAAABgAAAAAQAgAAAAAAAAJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AADA/+B/B/8AAID/wD4D/wAAgP+AHAf/AACA/4AMB/8AAID/AAgP/wAAgP4AAB//AACA/gAAH/8AAID8AAA//QAAgPwAAH/+AACA+AAAf/0AAID4AAD/8AAAgPAAAH+AAACA4AAAPgAAAIDgAAAAAQAAgMBgAAABAACAwGAAAAEAAIAA4AAAAwAAgAHgCAAHAACAAeAcAA8AAIAD4B4AHwAAgAPgP4B/AACAB+A///8AAIAP4D///wAAgA/gP///AACAH+A///8AAIAf4D///wAAgD/gP///AACAf+A///8AAIB/4D///wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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",
          "mimeType": "image/*"
        }
      }
    },
    "Theme2": {
      "diplayName": "Theme 2",
      "description": "Theme2 theme",
      "properties": {
        "topbar": {
          "topbar-bg-color": "#e20074",
          "topbar-item-text-color": " #ffffff",
          "topbar-text-color": " #ffffff",
          "topbar-left-bg-color": "#e20074",
          "topbar-item-text-hover-bg-color": " rgba(255, 255, 255, 0.12)",
          "topbar-menu-button-bg-color": "#262626",
          "logo-color": "#ffffff",
          "danger-button-bg": "#D32F2F",
          "info-message-bg": "#b3e5fc",
          "success-message-bg": "#c8e6c9",
          "warning-message-bg": "#ffecb3",
          "error-message-bg": "#ffcdd2"
        },
        "general": {
          "text-color": " rgba(0, 0, 0, 0.87)",
          "text-secondary-color": "#262626",
          "primary-color": "#e20074",
          "secondary-color": "#262626",
          "body-bg-color": " #f7f7f7",
          "content-bg-color": " #ffffff",
          "content-alt-bg-color": "",
          "overlay-content-bg-color": " #ffffff",
          "hover-bg-color": " rgba(0, 0, 0, 0.04)",
          "solid-surface-text-color": " #ffffff",
          "divider-color": " #e4e4e4",
          "button-hover-bg": "#d4016d"
        },
        "sidebar": {
          "menu-text-color": " #657380",
          "menu-bg-color": " #fdfeff",
          "menu-item-text-color": " #515c66",
          "menu-item-hover-bg-color": " #e4e4e4",
          "inline-menu-border-color": " #e4e4e4"
        }
      },
      "images" : {
        "logo": {
          "imageData": "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",
          "mimeType": "image/*"
        },
        "favicon": {
          "imageData": "AAABAAMAMDAAAAEAIACoJQAANgAAACAgAAABACAAqBAAAN4lAAAQEAAAAQAgAGgEAACGNgAAKAAAADAAAABgAAAAAQAgAAAAAAAAJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFYvAAdWLwBjVi8AhFYvAIJWLwCCVi8AglYvAIJXMACAWTEAJwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQiMAA3BIAFuXZgCInGkAhptpAIabaQCGm2kAhptpAIibaQBhnGoABQAAAAAAAAAAAAAAAJVjAAKPXgBSjFwAhIhZAIKEVQCCgFIAgnxOAIJ4SwB/dUkAJgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFYvAA1WLwDCVi8A/1YvAP9WLwD/Vi8A/1YvAP9YMQD6WTIATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZD0AOV87AOeEWAD/n2wA/55rAP+eawD/nmsA/55rAP+eawDunmsASAAAAAAAAAAAAAAAAJVjADiRYQDkjl0A/4paAP+GVwD/glMA/31QAP96TQC+dkkAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFYvAA1WLwDCVi8A/1YvAP9WLwD/Vi8A/1cwAP9ZMQD6WjMATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABvRAALakEAq2A7AP9fPQD/k2MA/59sAP+eawD/nmsA/55rAP+eawD/nmsAw55rABgAAAAAnGoAEJhmALSVYwD/kWAA/41dAP+JWQD/hFYA/4BSAOx9TwBDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFYvAA1WLwDCVi8A/1YvAP9WLwD/Vi8A/1cwAP9aMgD6WzMATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABvRABbbkQA92lBAP9YNwD/b0kA/51qAP+eawD/nmsA/55rAP+eawD/nmsA/p5rAIKgbQABnmsAc5tpAPuYZgD/k2IA/49fAP+LWwD/hlcA/4NUAIh5TAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFYvAA1WLwDCVi8A/1YvAP9WLwD/Vi8A/1gxAP9aMwD6XDQATQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG5EABxvRQDMcUYA/29FAP9mQAD/WDgA/4ZaAP+fbAD/nmsA/55rAP+eawD/nmsA/55rAOeeawBznmsA4J1rAP+aaAD/lmQA/5JhAP+NXQD/iVkAy4VXABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFYvAA1WLwDCVi8A/1YvAP9WLwD/Vi8A/1kxAP9bMwD7XDQAUAAAAAAAAAAAAAAAAAAAAAAAAAAAaD0AAW5EAIJwRQD/ckcA/3NIAP9vRgD/YT0A/2NBAP+XZgD/n2sA/55rAP+eawD/nmsA/55rAP+eawD3nmsA/p5rAP+cagD/mGYA/5RiAP+PXwDzjFwAUwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFYvAA1WLwDCVi8A/1YvAP9WLwD/VzAA/1kyAP9bNAD8XTUAUQAAAAAAAAAAAAAAAAAAAAAAAAAAbUMANm9EAOZxRgD/c0gA/3VKAP91SgD/bkYA/107AP93TwD/nmsA/55rAP+eawD/nmsA/55rAP+eawD/nmsA/55rAP+dawD/mmgA/5VkAP+RYACbjFwABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABWLwAKVi8ABFYvAA1WLwDCVi8A/1YvAP9WLwD/VzAA/1kyAP9cNAD8XTUAUQAAAAAAAAAAAAAAAAAAAABrQQAKbUMAqG9EAP9xRgD/dEgA/3ZKAP94TAD/dksA/2tEAP9ePQD/jF8A/59sAP+eawD/nmsA/55rAP+eawD/nmsA/55rAP+eawD/m2kA/5dlANiUYgAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFYvAAlWLwCYVi8AZVYvAA1WLwDCVi8A/1YvAP9WLwD/VzAA/1oyAP9cNAD8XjYAUQAAAAAAAAAAAAAAAAAAAABsQQBYbUMA9m9FAP9yRwD/dEkA/3dLAP95TQD/ek4A/3VLAP9lQQD/akYA/5poAP+eawD/nmsA/55rAP+eawD/nmsA/55rAP+eawD/nGoA+ZlnAGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFcwAAJWLwBSVi8AhVYvAA1WLwDCVi8A/1YvAP9WLwD/VzAA/1oyAP9cNAD8XjYAUQAAAAAAAAAAAAAAAGpAABprQQDKbUMA/3BFAP9yRwD/dUkA/3dLAP95TQD/fE8A/3tPAP9ySgD/Xj0A/3xTAP+eawD/nmsA/55rAP+eawD/nmsA/55rAP+eawD/nWoArJtoAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgVoRBl01AGlZMQCdVi8AR1YvAA1WLwDCVi8A/1YvAP9WLwD/WDAA/1oyAP9cNQD8XjYAUQAAAAAAAAAAAAAAAGk/AH9rQQD+bUMA/3BFAP9yRwD/dUkA/3dLAP96TQD/fE8A/31QAP94TgD/ZUIA/1c6AP+SYwD/n2sA/55rAP+eawD/nmsA/55rAP+hbwX7sYYkVwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5MRIAeTDSATqyktIyaY5pmY+BPJYMQD/Vi8Ar1YvAA1WLwDCVi8A/1YvAP9WLwD/WDAA/1oyAP9cNAD8XjYAUQAAAAAAAAAAZz4ANGk/AORrQQD/bUMA/3BFAP9yRwD/dUkA/3dLAP96TQD/fE8A/3xQAP92TQD/YkAA/2JBAP+YZwD/nmsA/55rAP+eawD/nmsA/55rAP+kcwn/07Vdnv//1wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADlxEgt5sVImujHSq/jwkftrooq/2A4Af9ZMQD/Vi8AtVYvAA1WLwDCVi8A/1YvAP9WLwD/VzAA/1oyAP9cNAD8XjYAUQAAAABkOwAJZj0ApWg/AP9rQQD/bUMA/3BFAP9yRwD/dEkA93dLAOB5TQD/e08A/3lOAP9tRgD/Xj4A/4pdAP+fbAD/nmsA/55rAP+eawD/nmsA/55rAP+fbAD/zatI9+valIvp2Zse6diWBenYlgjp2JYu6diYcunWj4fmx0++375E/7uWL/+PaBf/aUAE/101AP9ZMQD/Vi8AlFYvAA1WLwDCVi8A/1YvAP9WLwD/VzAA/1oyAP9cNAD8XjUAUQAAAABkOwBVZjwA9Wg+AP9qQAD/bUMA/29FAP9yRwD/dEgAt3dLAJN5TAD/eE0A/3FJAP9fPQD/dk8A/55rAP+eawD/nmsA/55rAP+eawD/nmsA/55rAP+dagD/soUX/+PJafzp15Da6diXs+nYmLvp2Jfn6daP/ufNa//hwEf/nncc/21DAf9lOwD/YTgA/101AP9YMQD4Vi8AXVYvAA1WLwDCVi8A/1YvAP9WLwD/VzAA/1kyAP9cNAD8XTUAUGI6ABRjOgDHZTwA/2g+AP9qQAD/bEIA/29EAP9xRgDvckcARHdLAH13SwD/c0kA/2RAAP9jQQD/lmYA/59rAP+eawD/nmsA/55rAP+eawD/nmsA/55rAP+eawD/nGkB/72TJP/jxVf/6M9w/+jQdv/nzm7/58lZ/+bFSf+2kSr/ckcC/2pAAP9mPAD/YTgA/1w0AP9YMQDVVi8AIFYvAA1WLwDCVi8A/1YvAP9WLwD/VzAA/1kxAP9bMwD7XDUAUWE4AHdiOgD+ZTwA/2c+AP9pQAD/bEIA/25EAP9wRQCXb0MAAXVJAH1zSAD/aUIA/1o6AP+FWgD/n2wA/55rAP+eawD/nmsA/55rAP+eawD/nmsA/55rAP+dagD/mWYA/5ZlAv+tghj/zqk0/9y5Qf/evEL/17Q9/7SOKP99Ugb/bkMA/2pAAP9lPAD/YDgA/1s0AP9YMQCBAAAAAFYvAA1WLwDCVi8A/1YvAP9WLwD/Vi8A/1gxAP9bMwD5XTUAgmA3AN5iOQD/ZDsA/2Y9AP9pPwD/a0EA/21DANxvRAAqAAAAAHFHAH1rRAD/WjkA/29JAP+dagD/nmsA/55rAP+eawD/nmsA/55rAP6eawDlnmsA+55rAP+baQD/l2UA/5JhAP+NXQD/jl8D/5NnC/+SZw3/h1sI/3hLAf9yRgD/bkMA/2k/AP9kOwD/XzcA/1szAM5YMQAfAAAAAFYvAA1WLwDCVi8A/1YvAP9WLwD/Vi8A/1gwAP9aMgD8XDQA5V82AP5hOAD/YzoA/2Y8AP9oPgD/akAA/GxCAHEAAAAAAAAAAGpCAH1fPAD/XDsA/5NjAP+fbAD/nmsA/55rAP+eawD/nmsA/55rANueawBDnmsAtJ1qAP+ZZwD/lWMA/5BgAP+MXAD/h1gA/4JTAP99TwD/eUwA/3VJAP9xRQD/bEEA/2c+AP9jOgD/XjYA6FszAEoAAAAAAAAAAFYvAA1WLwDCVi8A/1YvAP9WLwD/Vi8A/1cwAP9ZMgD/XDQA/142AP9gOAD/YjoA/2U7AP9nPQD/aT8AwGtBABQAAAAAAAAAAGA7AH1VNgD/f1UA/59sAP+eawD/nmsA/55rAP+eawD/nmsA+p5rAGwAAAAAnWsAJJpoALuWZAD/kmEA/45eAP+KWgD/hVYA/4FTAP99TwD/eEsA/3RIAP9vRAD/akAA/2Y8AP9hOQDmXjYAWlMsAAEAAAAAAAAAAFYvAA1WLwDCVi8A/1YvAP9WLwD/Vi8A/1YvAP9YMQD/WzMA/101AP9fNwD/YTkA/2Q7AP9mPADyZz4ATQAAAAAAAAAAAAAAAFQ0AH5rRQD/m2kA/55rAP+eawD/nmsA/55rAP+eawD/nmsAs55rAA8AAAAAAAAAAJdlABqTYgCSj18A74tbAP+HWAD/g1QA/39RAP96TQD/dkoA/3JGAP9tQgD/aT8A/GU7AMNhOABCVzAAAQAAAAAAAAAAAAAAAFYvAA1WLwDCVi8A/1YvAP9WLwD/Vi8A/1YvAP9XMAD/WjIA/1w0AP9eNgD/YDgA/2I6AP9kOwCdZz0ABgAAAAAAAAAAAAAAAGlDAH6QYQD/n2sA/55rAP+eawD/nmsA/55rAP+eawDnnmsAOgAAAAAAAAAAAAAAAAAAAACRYAAGjV0AQIlZAJyFVgDagFIA9HxPAPx4SwD+dEgA+XBEAOlsQQC9aD4AaGU7ABUAAAAAAAAAAAAAAAAAAAAAAAAAAFYvAA1WLwDCVi8A/1YvAP9WLwD/Vi8A/1YvAP9XMAD/WTEA/1szAP9dNQD/XzcA/2E4AOBjOgAuAAAAAAAAAAAAAAAAAAAAAHhMAH5/UQD/gFIA/4FTAP+CVAD/glQA/4NVAP+FVwClo28AAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIVXAAOCVAAbf1EAPXtNAFR3SgBZc0cASm9EACtrQQALAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFYvAA1WLwDCVi8A/1YvAP9WLwD/Vi8A/1YvAP9WLwD/WDAA/1oyAP9cNAD/XjYA/WA3AHcAAAAAAAAAAAAAAAAAAAAAAAAAAGtBAH1sQgD/bkMA/29EAP9wRgD/ckcA/3NIAP9zSACbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFYvAA1WLwDCVi8A/1YvAP9WLwD/Vi8A/1YvAP9WLwD/Vy8A/1gxAP9aMwD/XDQAxV42ABcAAAAAAAAAAAAAAAAAAAAAAAAAAGpAAH1rQQD/bEIA/25DAP9vRAD/cEUA/3FGAP9yRwCbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFYvAA1WLwDCVi8A/1YvAP9WLwD/Vi8A/1YvAP9WLwD/Vi8A/1cwAP9ZMgD0WzMAUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGg+AH1pPwD/akAA/2xCAP9tQwD/bkMA/29EAP9wRQCbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFYvAA1WLwDCVi8A/1YvAP9WLwD/Vi8A/1YvAP9WLwD/Vi8A/1YvAP9XMACjWjIACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGY9AH1nPQD/aD8A/2pAAP9rQQD/bEIA/21CAP9tQwCbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFYvAA1WLwDCVi8A/1YvAP9WLwD/Vi8A/1YvAP9WLwD/Vi8A/1YvAONWLwAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGQ7AH1lPAD/Zj0A/2c+AP9pPwD/akAA/2pAAP9rQQCbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFYvAA1WLwDCVi8A/1YvAP9WLwD/Vi8A/1YvAP9WLwD/Vi8A/lYvAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGI5AH1jOgD/ZDsA/2U8AP9mPQD/Zz4A/2g+AP9pPwCbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFYvAA1WLwDCVi8A/1YvAP9WLwD/Vi8A/1YvAP9WLwD/Vi8AylYvABoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGA3AH1hOAD/YjkA/2M6AP9kOwD/ZTwA/2Y8AP9mPQCbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFYvAAZWLwBUVi8AcFYvAG5WLwBuVi8AblYvAG5WLwBvVi8AOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF82ADZgNwBvYTgAbmI5AG5jOgBuZDsAbmQ7AHBlOwBDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AADA/+B/B/8AAID/wD4D/wAAgP+AHAf/AACA/4AMB/8AAID/AAgP/wAAgP4AAB//AACA/gAAH/8AAID8AAA//QAAgPwAAH/+AACA+AAAf/0AAID4AAD/8AAAgPAAAH+AAACA4AAAPgAAAIDgAAAAAQAAgMBgAAABAACAwGAAAAEAAIAA4AAAAwAAgAHgCAAHAACAAeAcAA8AAIAD4B4AHwAAgAPgP4B/AACAB+A///8AAIAP4D///wAAgA/gP///AACAH+A///8AAIAf4D///wAAgD/gP///AACAf+A///8AAIB/4D///wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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",
          "mimeType": "image/*"
        }
      }
    },
    "Theme3": {
      "displayName": "Theme 3",
      "description": "Theme3 basic color scheme",
      "properties": {
        "topbar": {
          "topbar-bg-color": " rgb(18, 171, 219)",
          "topbar-item-text-color": " #ffffff",
          "topbar-text-color": " #ffffff",
          "topbar-left-bg-color": " #ececec",
          "topbar-item-text-hover-bg-color": " rgba(255, 255, 255, 0.12)",
          "topbar-menu-button-bg-color": " rgb(255, 0, 68)",
          "logo-color": " rgb(18, 171, 219)",
          "danger-button-bg": "#D32F2F",
          "info-message-bg": "#b3e5fc",
          "success-message-bg": "#c8e6c9",
          "warning-message-bg": "#ffecb3",
          "error-message-bg": "#ffcdd2"
        },
        "general": {
          "text-color": " rgba(0, 0, 0, 0.87)",
          "text-secondary-color": " rgba(0, 0, 0, 0.6)",
          "primary-color": " rgb(18, 171, 219)",
          "secondary-color": " #ee4400",
          "body-bg-color": " #f7f7f7",
          "content-bg-color": " #ffffff",
          "content-alt-bg-color": "",
          "overlay-content-bg-color": " #ffffff",
          "hover-bg-color": " rgba(0, 0, 0, 0.04)",
          "solid-surface-text-color": " #ffffff",
          "divider-color": " #e4e4e4"
        },
        "sidebar": {
          "menu-text-color": " #657380",
          "menu-bg-color": " #fdfeff",
          "menu-item-text-color": " #515c66",
          "menu-item-hover-bg-color": " rgba(0, 0, 0, 0.04)",
          "inline-menu-border-color": " #e4e4e4"
        }
      },
      "images" : {
        "logo": {
          "imageData": "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",
          "mimeType": "image/*"
        },
        "favicon": {
          "imageData": "AAABAAMAMDAAAAEAIACoJQAANgAAACAgAAABACAAqBAAAN4lAAAQEAAAAQAgAGgEAACGNgAAKAAAADAAAABgAAAAAQAgAAAAAAAAJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AADA/+B/B/8AAID/wD4D/wAAgP+AHAf/AACA/4AMB/8AAID/AAgP/wAAgP4AAB//AACA/gAAH/8AAID8AAA//QAAgPwAAH/+AACA+AAAf/0AAID4AAD/8AAAgPAAAH+AAACA4AAAPgAAAIDgAAAAAQAAgMBgAAABAACAwGAAAAEAAIAA4AAAAwAAgAHgCAAHAACAAeAcAA8AAIAD4B4AHwAAgAPgP4B/AACAB+A///8AAIAP4D///wAAgA/gP///AACAH+A///8AAIAf4D///wAAgD/gP///AACAf+A///8AAIB/4D///wAA////////AAD///////8AAP///////wAA////////AAD///////8AAP///////wAA////////AAD///////8AACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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",
          "mimeType": "image/*"
        }
      }
    }
  }
}


```


