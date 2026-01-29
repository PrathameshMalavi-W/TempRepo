# Files from C:\Users\prath\onecx\onecx-other\onecx-parameter-svc\src

## Folder: onecx-parameter-svc/src/main/docker (2 files)

### File: onecx-parameter-svc/src/main/docker/Dockerfile.jvm

```dockerfile

FROM ghcr.io/onecx/docker-quarkus-jvm:0.26.0

COPY --chown=185 target/quarkus-app/lib/ /deployments/lib/
COPY --chown=185 target/quarkus-app/*.jar /deployments/
COPY --chown=185 target/quarkus-app/app/ /deployments/app/
COPY --chown=185 target/quarkus-app/quarkus/ /deployments/quarkus/
USER 185

```

### File: onecx-parameter-svc/src/main/docker/Dockerfile.native

```dockerfile

FROM ghcr.io/onecx/docker-quarkus-native:0.28.0

COPY --chown=1001:root target/*-runner /work/application

```

## Folder: onecx-parameter-svc/src/main/helm (2 files)

### File: onecx-parameter-svc/src/main/helm/Chart.yaml

```yaml

apiVersion: v2
name: onecx-parameter-svc
version: 0.0.0
appVersion: 0.0.0
description: Onecx parameter management
keywords:
  - iam
  - parameters
sources:
  - https://github.com/onecx/onecx-parameter-svc
maintainers:
  - name: Tkit Developer
    email: tkit_dev@1000kit.org
dependencies:
  - name: helm-quarkus-app
    alias: app
    version: 0.42.0
    repository: oci://ghcr.io/onecx/charts


```

### File: onecx-parameter-svc/src/main/helm/values.yaml

```yaml

app:
  name: svc
  image:
    repository: "onecx/onecx-parameter-svc"
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
        description: OneCX Parameter Backend Service
        name: OneCX Parameter SVC


```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/config (1 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/config/ParameterConfig.java

```java

package org.tkit.onecx.parameters.domain.config;

import io.quarkus.runtime.annotations.ConfigDocFilename;
import io.quarkus.runtime.annotations.ConfigPhase;
import io.quarkus.runtime.annotations.ConfigRoot;
import io.smallrye.config.ConfigMapping;
import io.smallrye.config.WithDefault;
import io.smallrye.config.WithName;

/**
 * Parameter svc configuration
 */
@ConfigDocFilename("onecx-parameter-svc.adoc")
@ConfigRoot(phase = ConfigPhase.RUN_TIME)
@ConfigMapping(prefix = "onecx.parameter")
public interface ParameterConfig {

    /**
     * Maintenance history scheduler configurations
     */
    @WithName("scheduler")
    MaintenanceHistoryScheduler maintenanceHistoryScheduler();

    interface MaintenanceHistoryScheduler {
        /**
         * Scheduler duration in days
         */
        @WithDefault("7")
        @WithName("duration")
        String duration();

        /**
         * Scheduler expression
         */
        @WithDefault("0 15 2 * * ?")
        @WithName("expression")
        String expression();
    }
}


```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/criteria (3 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/criteria/HistorySearchCriteria.java

```java

package org.tkit.onecx.parameters.domain.criteria;

import lombok.Getter;
import lombok.Setter;

/**
 * The application parameter search criteria.
 */
@Getter
@Setter
public class HistorySearchCriteria {

    /**
     * The application ID.
     */
    private String applicationId;

    /**
     * The product name
     */
    private String productName;

    /**
     * The parameter name.
     */
    private String name;

    private Integer pageNumber;

    private Integer pageSize;
}


```

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/criteria/NamesSearchCriteria.java

```java

package org.tkit.onecx.parameters.domain.criteria;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NamesSearchCriteria {

    private String applicationId;

    private String productName;

}


```

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/criteria/ParameterSearchCriteria.java

```java

package org.tkit.onecx.parameters.domain.criteria;

import lombok.Getter;
import lombok.Setter;

/**
 * The parameter search criteria.
 */
@Getter
@Setter
public class ParameterSearchCriteria {

    /**
     * The application ID.
     */
    private String applicationId;

    /**
     * The product name
     */
    private String productName;

    /**
     * The parameter key.
     */
    private String name;

    private Integer pageNumber;

    private Integer pageSize;
}


```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/daos (3 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/daos/HistoryDAO.java

```java

package org.tkit.onecx.parameters.domain.daos;

import static org.tkit.quarkus.jpa.utils.QueryCriteriaUtil.addSearchStringPredicate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.criteria.*;
import jakarta.transaction.Transactional;

import org.tkit.onecx.parameters.domain.criteria.HistorySearchCriteria;
import org.tkit.onecx.parameters.domain.models.*;
import org.tkit.quarkus.jpa.daos.AbstractDAO;
import org.tkit.quarkus.jpa.daos.Page;
import org.tkit.quarkus.jpa.daos.PageResult;
import org.tkit.quarkus.jpa.exceptions.DAOException;
import org.tkit.quarkus.jpa.models.AbstractTraceableEntity_;
import org.tkit.quarkus.jpa.models.TraceableEntity_;

@ApplicationScoped
@Transactional(value = Transactional.TxType.NOT_SUPPORTED, rollbackOn = DAOException.class)
public class HistoryDAO extends AbstractDAO<History> {

    @Transactional(value = Transactional.TxType.REQUIRED, rollbackOn = DAOException.class)
    public void deleteApplicationHistoryOlderThan(LocalDateTime date) {
        try {
            CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();
            CriteriaDelete<History> cd = deleteQuery();
            Root<History> root = cd.from(History.class);
            cd.where(cb.lessThanOrEqualTo(root.get(AbstractTraceableEntity_.CREATION_DATE), date));
            getEntityManager().createQuery(cd).executeUpdate();
        } catch (Exception e) {
            throw new DAOException(ErrorKeys.DELETE_PARAMETER_HISTORY_OLDER_THAN_FAILED, e);
        }
    }

    public PageResult<History> searchByCriteria(HistorySearchCriteria criteria) {
        try {
            CriteriaQuery<History> cq = criteriaQuery();
            Root<History> root = cq.from(History.class);
            List<Predicate> predicates = new ArrayList<>();
            CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();

            addSearchStringPredicate(predicates, cb, root.get(History_.PRODUCT_NAME), criteria.getProductName());
            addSearchStringPredicate(predicates, cb, root.get(History_.APPLICATION_ID), criteria.getApplicationId());
            addSearchStringPredicate(predicates, cb, root.get(History_.NAME), criteria.getName());

            if (!predicates.isEmpty()) {
                cq.where(cb.and(predicates.toArray(new Predicate[0])));
            }
            cq.orderBy(cb.asc(root.get(AbstractTraceableEntity_.CREATION_DATE)));
            return createPageQuery(cq, Page.of(criteria.getPageNumber(), criteria.getPageSize())).getPageResult();
        } catch (Exception exception) {
            throw new DAOException(ErrorKeys.FIND_ALL_PARAMETERS_HISTORY_FAILED, exception);
        }
    }

    public PageResult<History> searchOnlyLatestByCriteria(
            HistorySearchCriteria criteria) {
        try {
            CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();
            CriteriaQuery<History> cq = cb.createQuery(History.class);
            Root<History> root = cq.from(History.class);

            Subquery<Number> maxDateSubquery = cq.subquery(Number.class);
            Root<History> maxDateSubqueryRoot = maxDateSubquery.from(History.class);
            maxDateSubquery.select(cb.max(maxDateSubqueryRoot.get(AbstractTraceableEntity_.CREATION_DATE)))
                    .groupBy(maxDateSubqueryRoot.get(History_.INSTANCE_ID));

            List<Predicate> predicates = new ArrayList<>();
            predicates.add(root.get(AbstractTraceableEntity_.CREATION_DATE).in(maxDateSubquery));
            addSearchStringPredicate(predicates, cb, root.get(History_.PRODUCT_NAME), criteria.getProductName());
            addSearchStringPredicate(predicates, cb, root.get(History_.APPLICATION_ID), criteria.getApplicationId());
            addSearchStringPredicate(predicates, cb, root.get(History_.NAME), criteria.getName());

            cq.select(root)
                    .where(cb.and(predicates.toArray(new Predicate[0])))
                    .groupBy(root.get(History_.INSTANCE_ID), root.get(TraceableEntity_.ID));

            return createPageQuery(cq, Page.of(criteria.getPageNumber(), criteria.getPageSize())).getPageResult();
        } catch (Exception exception) {
            throw new DAOException(ErrorKeys.FIND_ALL_PARAMETERS_HISTORY_FAILED, exception);
        }
    }

    public List<HistoryCountTuple> searchCountsByCriteria(HistorySearchCriteria criteria) {
        try {
            var cb = getEntityManager().getCriteriaBuilder();
            CriteriaQuery<HistoryCountTuple> cq = cb.createQuery(HistoryCountTuple.class);
            Root<History> root = cq.from(History.class);
            cq.select(
                    cb.construct(HistoryCountTuple.class, root.get(AbstractTraceableEntity_.CREATION_DATE),
                            root.get(History_.COUNT)));
            List<Predicate> predicates = new ArrayList<>();

            addSearchStringPredicate(predicates, cb, root.get(History_.PRODUCT_NAME), criteria.getProductName());
            addSearchStringPredicate(predicates, cb, root.get(History_.APPLICATION_ID), criteria.getApplicationId());
            addSearchStringPredicate(predicates, cb, root.get(History_.NAME), criteria.getName());

            if (!predicates.isEmpty()) {
                cq.where(cb.and(predicates.toArray(new Predicate[0])));
            }
            return em.createQuery(cq).getResultList();
        } catch (Exception exception) {
            throw new DAOException(ErrorKeys.FIND_ALL_PARAMETERS_HISTORY_FAILED, exception);
        }
    }

    public List<ApplicationTuple> searchAllProductNamesAndApplicationIds() {
        try {
            var cb = getEntityManager().getCriteriaBuilder();
            CriteriaQuery<ApplicationTuple> cq = cb.createQuery(ApplicationTuple.class);
            Root<History> root = cq.from(History.class);
            cq.select(
                    cb.construct(ApplicationTuple.class, root.get(Parameter_.PRODUCT_NAME),
                            root.get(Parameter_.APPLICATION_ID)))
                    .distinct(true);
            return getEntityManager().createQuery(cq).getResultList();
        } catch (Exception exception) {
            throw new DAOException(ErrorKeys.FIND_ALL_APPLICATIONS_FAILED, exception);
        }
    }

    public enum ErrorKeys {
        DELETE_PARAMETER_HISTORY_OLDER_THAN_FAILED,
        FIND_ALL_APPLICATIONS_FAILED,
        FIND_ALL_PARAMETERS_HISTORY_FAILED;
    }
}


```

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/daos/JobDAO.java

```java

package org.tkit.onecx.parameters.domain.daos;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.LockModeType;
import jakarta.persistence.NoResultException;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;

import org.tkit.onecx.parameters.domain.models.Job;
import org.tkit.quarkus.jpa.daos.AbstractDAO;
import org.tkit.quarkus.jpa.exceptions.DAOException;
import org.tkit.quarkus.jpa.models.TraceableEntity_;

@ApplicationScoped
public class JobDAO extends AbstractDAO<Job> {

    @Transactional(value = Transactional.TxType.REQUIRED, rollbackOn = DAOException.class)
    public Job getJob(String id) throws DAOException {
        try {
            CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();
            CriteriaQuery<Job> cq = cb.createQuery(Job.class);
            Root<Job> root = cq.from(Job.class);
            cq.where(cb.equal(root.get(TraceableEntity_.ID), id));

            return getEntityManager()
                    .createQuery(cq)
                    .setMaxResults(1)
                    .setLockMode(LockModeType.PESSIMISTIC_WRITE)
                    .setHint("jakarta.persistence.lock.timeout", -2)
                    .getSingleResult();

        } catch (NoResultException ex) {
            return null;
        } catch (Exception ex) {
            throw new DAOException(Error.GET_JOB_FAILED, ex);
        }
    }

    public enum Error {

        GET_JOB_FAILED;
    }
}


```

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/daos/ParameterDAO.java

```java

package org.tkit.onecx.parameters.domain.daos;

import static org.tkit.quarkus.jpa.utils.QueryCriteriaUtil.addSearchStringPredicate;
import static org.tkit.quarkus.jpa.utils.QueryCriteriaUtil.createSearchStringPredicate;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.NoResultException;
import jakarta.persistence.criteria.*;
import jakarta.transaction.Transactional;

import org.tkit.onecx.parameters.domain.criteria.NamesSearchCriteria;
import org.tkit.onecx.parameters.domain.criteria.ParameterSearchCriteria;
import org.tkit.onecx.parameters.domain.models.*;
import org.tkit.quarkus.jpa.daos.AbstractDAO;
import org.tkit.quarkus.jpa.daos.Page;
import org.tkit.quarkus.jpa.daos.PageResult;
import org.tkit.quarkus.jpa.exceptions.DAOException;

@ApplicationScoped
@Transactional(value = Transactional.TxType.NOT_SUPPORTED, rollbackOn = DAOException.class)
public class ParameterDAO extends AbstractDAO<Parameter> {

    public Map<String, String> findAllValuesByProductNameAndApplicationId(String productName, String applicationId) {
        try {
            CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();
            CriteriaQuery<Parameter> cq = cb.createQuery(Parameter.class);
            Root<Parameter> root = cq.from(Parameter.class);
            cq.where(cb.and(
                    cb.equal(root.get(Parameter_.PRODUCT_NAME), productName),
                    cb.equal(root.get(Parameter_.APPLICATION_ID), applicationId),
                    cb.or(
                            cb.isNotNull(root.get(Parameter_.VALUE)),
                            cb.isNotNull(root.get(Parameter_.IMPORT_VALUE)))));

            return getEntityManager()
                    .createQuery(cq)
                    .getResultStream()
                    .collect(Collectors.toMap(Parameter::getName,
                            p -> p.getValue() != null ? p.getValue() : p.getImportValue()));
        } catch (Exception e) {
            throw new DAOException(ErrorKeys.FIND_ALL_PARAMETERS_VALUES_BY_APPLICATION_ID_FAILED, e);
        }
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public List<Parameter> findAllByProductNameAndApplicationId(String productName, String applicationId) {
        try {
            CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();
            CriteriaQuery<Parameter> cq = cb.createQuery(Parameter.class);
            Root<Parameter> root = cq.from(Parameter.class);
            cq.where(
                    cb.and(
                            cb.equal(root.get(Parameter_.PRODUCT_NAME), productName),
                            cb.equal(root.get(Parameter_.APPLICATION_ID), applicationId)));
            return getEntityManager()
                    .createQuery(cq)
                    .getResultList();
        } catch (Exception e) {
            throw new DAOException(ErrorKeys.FIND_ALL_PARAMETERS_BY_APPLICATION_ID_FAILED, e);
        }
    }

    public Stream<Parameter> findAllByProductNames(Set<String> productNames) {
        try {
            CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();
            CriteriaQuery<Parameter> cq = cb.createQuery(Parameter.class);
            Root<Parameter> root = cq.from(Parameter.class);
            if (productNames != null && !productNames.isEmpty()) {
                cq.where(root.get(Parameter_.PRODUCT_NAME).in(productNames));
            }

            return getEntityManager()
                    .createQuery(cq)
                    .getResultStream();
        } catch (Exception e) {
            throw new DAOException(ErrorKeys.FIND_ALL_PARAMETERS_BY_PRODUCT_NAMES_FAILED, e);
        }
    }

    public Parameter findByNameApplicationIdAndProductName(String name, String applicationId, String productName) {
        try {
            CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();
            CriteriaQuery<Parameter> cq = cb.createQuery(Parameter.class);
            Root<Parameter> root = cq.from(Parameter.class);

            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get(Parameter_.PRODUCT_NAME), productName));
            predicates.add(cb.equal(root.get(Parameter_.APPLICATION_ID), applicationId));
            predicates.add(cb.equal(root.get(Parameter_.NAME), name));
            cq.where(cb.and(predicates.toArray(new Predicate[0])));
            return getEntityManager().createQuery(cq).getSingleResult();
        } catch (NoResultException nre) {
            return null;
        } catch (Exception exception) {
            throw new DAOException(ErrorKeys.FIND_BY_NAME_PRODUCT_NAME_APPLICATION_ID_FAILED, exception);
        }
    }

    @Transactional
    public PageResult<ParameterSearchResultItemTuple> searchByCriteria(ParameterSearchCriteria criteria) {
        try {
            CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();
            CriteriaQuery<Parameter> cq = cb.createQuery(Parameter.class);
            Root<Parameter> root = cq.from(Parameter.class);

            List<Predicate> predicates = new ArrayList<>();
            addSearchStringPredicate(predicates, cb, root.get(Parameter_.PRODUCT_NAME), criteria.getProductName());
            addSearchStringPredicate(predicates, cb, root.get(Parameter_.APPLICATION_ID), criteria.getApplicationId());

            if (criteria.getName() != null && !criteria.getName().isBlank()) {
                var namePredicate = createSearchStringPredicate(cb, root.get(Parameter_.NAME), criteria.getName());
                var displayNamePredicate = createSearchStringPredicate(cb, root.get(Parameter_.DISPLAY_NAME),
                        criteria.getName());
                predicates.add(cb.or(namePredicate, displayNamePredicate));
            }

            if (!predicates.isEmpty()) {
                cq.where(cb.and(predicates.toArray(new Predicate[0])));
            }

            PageResult<Parameter> parameterPageResult = createPageQuery(cq,
                    Page.of(criteria.getPageNumber(), criteria.getPageSize())).getPageResult();

            // Map to ParameterSearchResultItemTuple and set the isInHistory flag
            List<ParameterSearchResultItemTuple> parameterTupleList = parameterPageResult.getStream()
                    .map(parameter -> {
                        CriteriaQuery<Long> subquery = cb.createQuery(Long.class);
                        Root<History> historyRoot = subquery.from(History.class);
                        subquery.select(cb.count(historyRoot));
                        subquery.where(
                                cb.equal(historyRoot.get(History_.NAME), parameter.getName()),
                                cb.equal(historyRoot.get(History_.APPLICATION_ID), parameter.getApplicationId()),
                                cb.equal(historyRoot.get(History_.PRODUCT_NAME), parameter.getProductName()),
                                cb.equal(historyRoot.get(History_.TENANT_ID), parameter.getTenantId()));
                        Long count = getEntityManager().createQuery(subquery).getSingleResult();
                        boolean isInHistory = count > 0;
                        return new ParameterSearchResultItemTuple(parameter, isInHistory);
                    })
                    .toList();

            return new PageResult<>(parameterPageResult.getTotalElements(), parameterTupleList.stream(),
                    parameterPageResult.getNumber(), parameterPageResult.getSize());
        } catch (Exception exception) {
            throw new DAOException(ErrorKeys.FIND_ALL_PARAMETERS_FAILED, exception);
        }
    }

    public PageResult<String> searchAllNames(NamesSearchCriteria criteria) {
        try {
            var cb = getEntityManager().getCriteriaBuilder();
            CriteriaQuery<String> cq = cb.createQuery(String.class);
            Root<Parameter> root = cq.from(Parameter.class);
            cq.select(root.get(Parameter_.NAME)).distinct(true);
            cq.where(cb.equal(root.get(Parameter_.PRODUCT_NAME), criteria.getProductName()));

            if (criteria.getApplicationId() != null) {
                cq.where(cb.equal(root.get(Parameter_.APPLICATION_ID), criteria.getApplicationId()));
            }

            var results = getEntityManager().createQuery(cq).getResultList();
            return new PageResult<>(results.size(), results.stream(), Page.of(0, 1));
        } catch (Exception exception) {
            throw new DAOException(ErrorKeys.FIND_ALL_NAMES_FAILED, exception);
        }
    }

    public List<ApplicationTuple> searchAllProductNamesAndApplicationIds() {
        try {
            var cb = getEntityManager().getCriteriaBuilder();
            CriteriaQuery<ApplicationTuple> cq = cb.createQuery(ApplicationTuple.class);
            Root<Parameter> root = cq.from(Parameter.class);
            cq.select(
                    cb.construct(ApplicationTuple.class, root.get(Parameter_.PRODUCT_NAME),
                            root.get(Parameter_.APPLICATION_ID)))
                    .distinct(true);
            return getEntityManager().createQuery(cq).getResultList();
        } catch (Exception exception) {
            throw new DAOException(ErrorKeys.FIND_ALL_APPLICATIONS_FAILED, exception);
        }
    }

    public List<Parameter> findAllByProductNamesAndApplicationIds(Map<String, Set<String>> productAppMap) {
        try {
            CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();
            CriteriaQuery<Parameter> cq = cb.createQuery(Parameter.class);
            Root<Parameter> root = cq.from(Parameter.class);

            if (!productAppMap.isEmpty()) {
                List<Predicate> predicates = new ArrayList<>();

                for (Map.Entry<String, Set<String>> entry : productAppMap.entrySet()) {
                    String productName = entry.getKey();
                    Set<String> appIds = entry.getValue();

                    for (String appId : appIds) {
                        predicates.add(cb.and(
                                cb.equal(root.get(Parameter_.PRODUCT_NAME), productName),
                                cb.equal(root.get(Parameter_.APPLICATION_ID), appId)));
                    }
                }

                cq.where(cb.or(predicates.toArray(new Predicate[0])));
            }

            return getEntityManager().createQuery(cq).getResultList();

        } catch (Exception e) {
            throw new DAOException(ErrorKeys.FIND_ALL_PARAMETERS_BY_PRODUCT_NAMES_AND_APP_IDS_FAILED, e);
        }
    }

    public enum ErrorKeys {

        FIND_ALL_PARAMETERS_VALUES_BY_APPLICATION_ID_FAILED,
        FIND_ALL_PARAMETERS_BY_APPLICATION_ID_FAILED,
        FIND_ALL_APPLICATIONS_FAILED,
        FIND_ALL_NAMES_FAILED,
        FIND_ALL_PARAMETERS_FAILED,
        FIND_BY_NAME_PRODUCT_NAME_APPLICATION_ID_FAILED,
        FIND_ALL_PARAMETERS_BY_PRODUCT_NAMES_FAILED,
        FIND_ALL_PARAMETERS_BY_PRODUCT_NAMES_AND_APP_IDS_FAILED
    }
}


```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/models (6 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/models/ApplicationTuple.java

```java

package org.tkit.onecx.parameters.domain.models;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public record ApplicationTuple(String productName, String appId) {
}

```

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/models/History.java

```java

package org.tkit.onecx.parameters.domain.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import org.hibernate.annotations.TenantId;
import org.tkit.quarkus.jpa.models.TraceableEntity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "HISTORY", indexes = {
        @Index(name = "IDX_HISTORY_V1", columnList = "PRODUCT_NAME, APP_ID, TENANT_ID") })
@SuppressWarnings("java:S2160")
public class History extends TraceableEntity {

    @TenantId
    @Column(name = "TENANT_ID", nullable = false)
    private String tenantId;

    /**
     * The parameter key.
     */
    @Column(name = "NAME", nullable = false)
    private String name;

    /**
     * The application.
     */
    @Column(name = "APP_ID", nullable = false)
    private String applicationId;

    /**
     * The product
     */
    @Column(name = "PRODUCT_NAME", nullable = false)
    private String productName;

    /**
     * The parameter used value.
     */
    @Column(name = "USED_VALUE", columnDefinition = "varchar(5000)")
    private String usedValue;

    /**
     * The parameter used value.
     */
    @Column(name = "DEFAULT_VALUE", columnDefinition = "varchar(5000)")
    private String defaultValue;

    /**
     * Count of hit
     */
    @Column(name = "COUNT")
    private Long count;

    /**
     * Interval start time
     */
    @Column(name = "INTERVAL_START")
    private LocalDateTime start;

    /**
     * Interval end time
     */
    @Column(name = "INTERVAL_END")
    private LocalDateTime end;

    /**
     * The instance ID.
     */
    @Column(name = "INSTANCE_ID")
    private String instanceId;
}


```

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/models/HistoryCountTuple.java

```java

package org.tkit.onecx.parameters.domain.models;

import java.time.LocalDateTime;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@RegisterForReflection
public class HistoryCountTuple {

    private LocalDateTime creationDate;

    private Long count;

    public HistoryCountTuple(LocalDateTime creationDate, Long count) {
        this.creationDate = creationDate;
        this.count = count;
    }
}


```

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/models/Job.java

```java

package org.tkit.onecx.parameters.domain.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import org.tkit.quarkus.jpa.models.TraceableEntity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "JOB")
public class Job extends TraceableEntity {

}


```

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/models/Parameter.java

```java

package org.tkit.onecx.parameters.domain.models;

import jakarta.persistence.*;

import org.hibernate.annotations.TenantId;
import org.tkit.quarkus.jpa.models.TraceableEntity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "PARAMETER", uniqueConstraints = {
        @UniqueConstraint(name = "PARAMETER_CONSTRAINT", columnNames = { "NAME", "APP_ID", "PRODUCT_NAME",
                "TENANT_ID" }) }, indexes = {
                        @Index(name = "IDX_PARAMETER_V1", columnList = "PRODUCT_NAME, APP_ID, TENANT_ID") })
@SuppressWarnings("java:S2160")
public class Parameter extends TraceableEntity {

    @TenantId
    @Column(name = "TENANT_ID", nullable = false)
    private String tenantId;

    /**
     * The parameter key.
     */
    @Column(name = "NAME", nullable = false)
    private String name;

    /**
     * The display parameter name.
     */
    @Column(name = "DISPLAY_NAME")
    private String displayName;

    /**
     * The name of the parameter as it appears in functional specifications
     * (FSS).
     */
    @Column(name = "DESCRIPTION")
    private String description;

    /**
     * The application.
     */
    @Column(name = "APP_ID", nullable = false)
    private String applicationId;

    /**
     * The product
     */
    @Column(name = "PRODUCT_NAME", nullable = false)
    private String productName;

    /**
     * The parameter value.
     */
    @Column(name = "VALUE", columnDefinition = "varchar(5000)")
    private String value;

    /**
     * The parameter import value.
     */
    @Column(name = "IMPORT_VALUE", columnDefinition = "varchar(5000)")
    private String importValue;

    /**
     * The parameter import value.
     */
    @Column(name = "OPERATOR")
    private boolean operator;

}


```

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/models/ParameterSearchResultItemTuple.java

```java

package org.tkit.onecx.parameters.domain.models;

public record ParameterSearchResultItemTuple(Parameter parameter, boolean isInHistory) {
}


```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/services (1 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/services/ParameterService.java

```java

package org.tkit.onecx.parameters.domain.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import org.tkit.onecx.parameters.domain.daos.HistoryDAO;
import org.tkit.onecx.parameters.domain.daos.ParameterDAO;
import org.tkit.onecx.parameters.domain.models.Parameter;
import org.tkit.onecx.parameters.rs.bff.v1.mappers.ParameterMapperBffV1;
import org.tkit.onecx.parameters.rs.internal.mappers.ParameterMapper;

import gen.org.tkit.onecx.parameters.rs.internal.model.HistoryCriteriaDTO;
import gen.org.tkit.onecx.parameters.rs.internal.model.HistoryPageResultDTO;
import gen.org.tkit.onecx.parameters.rs.v1.bff.model.ParameterBffDTOV1;
import gen.org.tkit.onecx.parameters.rs.v1.bff.model.ParametersBulkResponseBffDTOV1;

@ApplicationScoped
public class ParameterService {

    @Inject
    ParameterDAO dao;

    @Inject
    HistoryDAO historyDAO;

    @Inject
    ParameterMapper applicationParameterInternalMapper;

    @Inject
    ParameterMapperBffV1 parameterBffMapper;

    @Transactional
    public void importParameters(List<Parameter> create, List<Parameter> update) {
        dao.create(create);
        dao.update(update);
    }

    @Transactional
    public void operatorImportParameters(String productName, String applicationId, List<Parameter> request) {
        var params = dao.findAllByProductNameAndApplicationId(productName, applicationId);
        var map = params.stream().collect(Collectors.toMap(Parameter::getName, p -> p));

        var update = new ArrayList<Parameter>();
        var create = new ArrayList<Parameter>();

        //item == item to import
        //map current available params
        for (var item : request) {
            var parameter = map.get(item.getName());
            if (parameter == null) {
                create.add(item);
            } else {
                map.remove(item.getName());
                update.add(parameter);

                parameter.setOperator(item.isOperator());
                parameter.setDescription(item.getDescription());
                parameter.setDisplayName(item.getDisplayName());
                parameter.setImportValue(item.getImportValue());
            }
        }

        // update all not imported parameters to operator false
        for (var param : map.values()) {
            param.setOperator(false);
            update.add(param);
        }

        // create or update
        dao.create(create);
        dao.update(update);
    }

    @Transactional
    public HistoryPageResultDTO getLatestHistoryEntries(HistoryCriteriaDTO criteriaDTO) {
        var criteria = applicationParameterInternalMapper.map(criteriaDTO);
        var parametersHistories = historyDAO.searchOnlyLatestByCriteria(criteria);
        var pageResult = applicationParameterInternalMapper.mapHistory(parametersHistories);
        pageResult.getStream().forEach(historyDTO -> {
            var parameter = dao.findByNameApplicationIdAndProductName(historyDTO.getName(), historyDTO.getApplicationId(),
                    historyDTO.getProductName());
            if (parameter != null) {
                historyDTO.setParameterId(parameter.getId());
            }
        });
        return pageResult;
    }

    public ParametersBulkResponseBffDTOV1 getGroupedParametersByProductsAndApps(
            Map<String, Set<String>> request) {
        var parameters = dao.findAllByProductNamesAndApplicationIds(request);
        var grouped = parameters.stream()
                .map(parameter -> parameterBffMapper.parameterToParameterBffDTOV1(parameter))
                .collect(Collectors.groupingBy(
                        ParameterBffDTOV1::getProductName,
                        Collectors.groupingBy(ParameterBffDTOV1::getApplicationId)));
        ParametersBulkResponseBffDTOV1 response = new ParametersBulkResponseBffDTOV1();
        response.setProducts(grouped);
        return response;
    }
}


```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/timer (1 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/domain/timer/MaintenanceHistoryService.java

```java

package org.tkit.onecx.parameters.domain.timer;

import java.time.LocalDateTime;

import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

import org.tkit.onecx.parameters.domain.config.ParameterConfig;
import org.tkit.onecx.parameters.domain.daos.HistoryDAO;
import org.tkit.onecx.parameters.domain.daos.JobDAO;
import org.tkit.onecx.parameters.domain.models.Job;
import org.tkit.quarkus.context.ApplicationContext;
import org.tkit.quarkus.context.Context;
import org.tkit.quarkus.jpa.exceptions.DAOException;
import org.tkit.quarkus.jpa.tenant.ContextTenantResolverConfig;

import io.quarkus.scheduler.Scheduled;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Singleton
public class MaintenanceHistoryService {

    @Inject
    ParameterConfig parameterConfig;

    @Inject
    HistoryDAO dao;

    @Inject
    JobDAO jobDAO;

    @Inject
    ContextTenantResolverConfig tenantConfig;

    static final String JOB_ID = "maintenance.history";
    private static final String PRINCIPAL = "history-maintenance";

    // find older items and delete it
    @Scheduled(identity = "maintenance.history", cron = "${onecx.parameter.scheduler.expression}")
    @Transactional(value = Transactional.TxType.REQUIRES_NEW, rollbackOn = DAOException.class)
    void maintenanceHistoryData() {
        LocalDateTime dt = LocalDateTime.now()
                .minusDays(Long.parseLong(parameterConfig.maintenanceHistoryScheduler().duration()));
        try {
            log.info("Scheduler for job id: '{}' started.", JOB_ID);
            var tenantId = Boolean.TRUE.equals(tenantConfig.root().enabled()) ? tenantConfig.root().value()
                    : tenantConfig.defaultTenantValue();
            var ctx = Context.builder()
                    .principal(PRINCIPAL)
                    .tenantId(tenantId)
                    .build();

            ApplicationContext.start(ctx);
            Job job = jobDAO.getJob(JOB_ID);
            if (job != null) {
                dao.deleteApplicationHistoryOlderThan(dt);
                log.info("Scheduler for job id: '{}' finished.", JOB_ID);
            }
        } catch (Exception ex) {
            log.error("Scheduler for job id: '" + JOB_ID + "' failed.", ex);
            throw ex;
        }
    }
}

```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/bff/v1/controllers (1 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/bff/v1/controllers/ParameterRestControllerBffV1.java

```java

package org.tkit.onecx.parameters.rs.bff.v1.controllers;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;

import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;
import org.tkit.onecx.parameters.domain.services.ParameterService;
import org.tkit.onecx.parameters.rs.bff.v1.mappers.ExceptionMapperBffV1;
import org.tkit.quarkus.log.cdi.LogService;

import gen.org.tkit.onecx.parameters.rs.v1.bff.ParametersBffApi;
import gen.org.tkit.onecx.parameters.rs.v1.bff.model.ParametersBulkRequestBffDTOV1;
import gen.org.tkit.onecx.parameters.rs.v1.bff.model.ProblemDetailResponseBffDTOV1;

@LogService
@ApplicationScoped
@Transactional(value = Transactional.TxType.NOT_SUPPORTED)
public class ParameterRestControllerBffV1 implements ParametersBffApi {

    @Inject
    ExceptionMapperBffV1 exceptionMapper;

    @Inject
    ParameterService parameterService;

    @Override
    public Response getParametersByProductsAndAppIds(ParametersBulkRequestBffDTOV1 request) {
        var result = parameterService.getGroupedParametersByProductsAndApps(request.getProducts());
        return Response.status(Response.Status.OK).entity(result).build();
    }

    @ServerExceptionMapper
    public RestResponse<ProblemDetailResponseBffDTOV1> constraint(ConstraintViolationException ex) {
        return exceptionMapper.constraint(ex);
    }

}


```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/bff/v1/mappers (2 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/bff/v1/mappers/ExceptionMapperBffV1.java

```java

package org.tkit.onecx.parameters.rs.bff.v1.mappers;

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

import gen.org.tkit.onecx.parameters.rs.v1.bff.model.ProblemDetailInvalidParamBffDTOV1;
import gen.org.tkit.onecx.parameters.rs.v1.bff.model.ProblemDetailParamBffDTOV1;
import gen.org.tkit.onecx.parameters.rs.v1.bff.model.ProblemDetailResponseBffDTOV1;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Mapper(uses = { OffsetDateTimeMapper.class })
public abstract class ExceptionMapperBffV1 {

    public RestResponse<ProblemDetailResponseBffDTOV1> constraint(ConstraintViolationException ex) {
        var dto = exception(ErrorKeys.CONSTRAINT_VIOLATIONS.name(), ex.getMessage());
        dto.setInvalidParams(createErrorValidationResponse(ex.getConstraintViolations()));
        return RestResponse.status(Response.Status.BAD_REQUEST, dto);
    }

    @Mapping(target = "removeParamsItem", ignore = true)
    @Mapping(target = "params", ignore = true)
    @Mapping(target = "invalidParams", ignore = true)
    @Mapping(target = "removeInvalidParamsItem", ignore = true)
    public abstract ProblemDetailResponseBffDTOV1 exception(String errorCode, String detail);

    public List<ProblemDetailParamBffDTOV1> map(Map<String, Object> params) {
        if (params == null) {
            return List.of();
        }
        return params.entrySet().stream().map(e -> {
            var item = new ProblemDetailParamBffDTOV1();
            item.setKey(e.getKey());
            if (e.getValue() != null) {
                item.setValue(e.getValue().toString());
            }
            return item;
        }).toList();
    }

    public abstract List<ProblemDetailInvalidParamBffDTOV1> createErrorValidationResponse(
            Set<ConstraintViolation<?>> constraintViolation);

    @Mapping(target = "name", source = "propertyPath")
    @Mapping(target = "message", source = "message")
    public abstract ProblemDetailInvalidParamBffDTOV1 createError(ConstraintViolation<?> constraintViolation);

    public String mapPath(Path path) {
        return path.toString();
    }

    public enum ErrorKeys {

        OPTIMISTIC_LOCK,
        CONSTRAINT_VIOLATIONS;
    }
}


```

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/bff/v1/mappers/ParameterMapperBffV1.java

```java

package org.tkit.onecx.parameters.rs.bff.v1.mappers;

import jakarta.inject.Inject;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.tkit.onecx.parameters.domain.models.Parameter;
import org.tkit.onecx.parameters.rs.internal.mappers.ParameterMapper;
import org.tkit.quarkus.rs.mappers.OffsetDateTimeMapper;

import com.fasterxml.jackson.databind.ObjectMapper;

import gen.org.tkit.onecx.parameters.rs.v1.bff.model.ParameterBffDTOV1;

@Mapper(uses = OffsetDateTimeMapper.class)
public abstract class ParameterMapperBffV1 {
    @Inject
    ObjectMapper objectMapper;

    @Mapping(source = "productName", target = "productName")
    @Mapping(source = "applicationId", target = "applicationId")
    @Mapping(target = "value", source = "value", qualifiedByName = "s2o")
    @Mapping(target = "importValue", source = "importValue", qualifiedByName = "s2o")
    public abstract ParameterBffDTOV1 parameterToParameterBffDTOV1(Parameter parameter);

    @Named("s2o")
    public Object s2o(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return objectMapper.readValue(value, Object.class);
        } catch (Exception e) {
            throw new ParameterMapper.MapperException("Error reading parameter value", e);
        }
    }
}


```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/external/v1/controllers (1 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/external/v1/controllers/ParameterRestControllerV1.java

```java

package org.tkit.onecx.parameters.rs.external.v1.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;

import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;
import org.tkit.onecx.parameters.domain.daos.HistoryDAO;
import org.tkit.onecx.parameters.domain.daos.ParameterDAO;
import org.tkit.onecx.parameters.domain.models.History;
import org.tkit.onecx.parameters.rs.external.v1.mappers.ExceptionMapperV1;
import org.tkit.onecx.parameters.rs.external.v1.mappers.ParameterMapperV1;
import org.tkit.quarkus.log.cdi.LogService;

import gen.org.tkit.onecx.parameters.rs.v1.ParameterApi;
import gen.org.tkit.onecx.parameters.rs.v1.model.ParametersBucketDTOV1;
import gen.org.tkit.onecx.parameters.rs.v1.model.ProblemDetailResponseDTOV1;

@LogService
@ApplicationScoped
@Transactional(value = Transactional.TxType.NOT_SUPPORTED)
public class ParameterRestControllerV1 implements ParameterApi {

    @Inject
    ParameterDAO applicationParameterDAO;

    @Inject
    HistoryDAO historyDAO;

    @Inject
    ParameterMapperV1 mapper;

    @Inject
    ExceptionMapperV1 exceptionMapper;

    @Override
    public Response getParameters(String productName, String appId) {
        Map<String, String> applicationParameters = applicationParameterDAO.findAllValuesByProductNameAndApplicationId(
                productName,
                appId);
        if (applicationParameters.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(mapper.mapParameters(applicationParameters)).build();
    }

    @Override
    public Response bucketRequest(String productName, String appId, ParametersBucketDTOV1 dto) {
        if (dto.getParameters() == null || dto.getParameters().isEmpty()) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }
        List<History> items = new ArrayList<>();
        dto.getParameters().forEach((name, value) -> items
                .add(mapper.mapItem(value, name, dto, productName, appId)));
        historyDAO.create(items);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @ServerExceptionMapper
    public RestResponse<ProblemDetailResponseDTOV1> constraint(ConstraintViolationException ex) {
        return exceptionMapper.constraint(ex);
    }
}


```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/external/v1/log (1 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/external/v1/log/ParameterLogParamV1.java

```java

package org.tkit.onecx.parameters.rs.external.v1.log;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;

import org.tkit.quarkus.log.cdi.LogParam;

import gen.org.tkit.onecx.parameters.rs.v1.model.ParametersBucketDTOV1;

@ApplicationScoped
public class ParameterLogParamV1 implements LogParam {

    @Override
    public List<Item> getClasses() {
        return List.of(
                item(10, ParametersBucketDTOV1.class,
                        x -> x.getClass().getSimpleName() + ":" + ((ParametersBucketDTOV1) x).getInstanceId()));
    }
}


```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/external/v1/mappers (2 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/external/v1/mappers/ExceptionMapperV1.java

```java

package org.tkit.onecx.parameters.rs.external.v1.mappers;

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

import gen.org.tkit.onecx.parameters.rs.v1.model.ProblemDetailInvalidParamDTOV1;
import gen.org.tkit.onecx.parameters.rs.v1.model.ProblemDetailParamDTOV1;
import gen.org.tkit.onecx.parameters.rs.v1.model.ProblemDetailResponseDTOV1;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Mapper(uses = { OffsetDateTimeMapper.class })
public abstract class ExceptionMapperV1 {

    public RestResponse<ProblemDetailResponseDTOV1> constraint(ConstraintViolationException ex) {
        var dto = exception(ErrorKeys.CONSTRAINT_VIOLATIONS.name(), ex.getMessage());
        dto.setInvalidParams(createErrorValidationResponse(ex.getConstraintViolations()));
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

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/external/v1/mappers/ParameterMapperV1.java

```java

package org.tkit.onecx.parameters.rs.external.v1.mappers;

import java.util.HashMap;
import java.util.Map;

import jakarta.inject.Inject;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.tkit.onecx.parameters.domain.models.History;
import org.tkit.quarkus.rs.mappers.OffsetDateTimeMapper;

import com.fasterxml.jackson.databind.ObjectMapper;

import gen.org.tkit.onecx.parameters.rs.v1.model.ParameterInfoDTOV1;
import gen.org.tkit.onecx.parameters.rs.v1.model.ParametersBucketDTOV1;

@Mapper(uses = OffsetDateTimeMapper.class)
public abstract class ParameterMapperV1 {

    @Inject
    ObjectMapper objectMapper;

    public Map<String, Object> mapParameters(Map<String, String> parameters) {
        Map<String, Object> data = new HashMap<>();
        if (parameters == null) {
            return data;
        }
        try {
            for (Map.Entry<String, String> e : parameters.entrySet()) {
                if (e.getValue() == null || e.getValue().isBlank()) {
                    data.put(e.getKey(), null);
                } else {
                    data.put(e.getKey(), objectMapper.readValue(e.getValue(), Object.class));
                }
            }
        } catch (Exception e) {
            throw new MapperException("Error reading parameter", e);
        }
        return data;
    }

    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "creationUser", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "modificationUser", ignore = true)
    @Mapping(target = "controlTraceabilityManual", ignore = true)
    @Mapping(target = "modificationCount", ignore = true)
    @Mapping(target = "persisted", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "usedValue", source = "dto.currentValue", qualifiedByName = "o2s")
    @Mapping(target = "defaultValue", source = "dto.defaultValue", qualifiedByName = "o2s")
    public abstract History mapItem(ParameterInfoDTOV1 dto, String name, ParametersBucketDTOV1 bucketDTO,
            String productName, String applicationId);

    public static class MapperException extends RuntimeException {

        public MapperException(String msg, Throwable t) {
            super(msg, t);
        }

    }

    @Named("o2s")
    public String o2s(Object value) {
        if (value == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception e) {
            throw new MapperException("Error reading parameter value", e);
        }
    }

}


```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/external/v2/controllers (1 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/external/v2/controllers/ParameterRestControllerV2.java

```java

package org.tkit.onecx.parameters.rs.external.v2.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;

import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;
import org.tkit.onecx.parameters.domain.daos.HistoryDAO;
import org.tkit.onecx.parameters.domain.daos.ParameterDAO;
import org.tkit.onecx.parameters.domain.models.History;
import org.tkit.onecx.parameters.rs.external.v2.mappers.ExceptionMapperV2;
import org.tkit.onecx.parameters.rs.external.v2.mappers.ParameterMapperV2;
import org.tkit.quarkus.log.cdi.LogService;

import gen.org.tkit.onecx.parameters.rs.v2.ParameterApiV2;
import gen.org.tkit.onecx.parameters.rs.v2.model.ParametersBucketDTOV2;
import gen.org.tkit.onecx.parameters.rs.v2.model.ProblemDetailResponseDTOV2;

@LogService
@ApplicationScoped
@Transactional(value = Transactional.TxType.NOT_SUPPORTED)
public class ParameterRestControllerV2 implements ParameterApiV2 {

    @Inject
    ParameterDAO applicationParameterDAO;

    @Inject
    HistoryDAO historyDAO;

    @Inject
    ParameterMapperV2 mapper;

    @Inject
    ExceptionMapperV2 exceptionMapper;

    @Override
    public Response getParameters(String productName, String appId) {
        Map<String, String> applicationParameters = applicationParameterDAO.findAllValuesByProductNameAndApplicationId(
                productName,
                appId);
        if (applicationParameters.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(mapper.mapParameters(applicationParameters)).build();
    }

    @Override
    public Response bucketRequest(String productName, String appId, ParametersBucketDTOV2 dto) {
        if (dto.getParameters() == null || dto.getParameters().isEmpty()) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }
        List<History> items = new ArrayList<>();
        dto.getParameters().forEach((name, value) -> items
                .add(mapper.mapItem(value, name, dto, productName, appId)));
        historyDAO.create(items);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @ServerExceptionMapper
    public RestResponse<ProblemDetailResponseDTOV2> constraint(ConstraintViolationException ex) {
        return exceptionMapper.constraint(ex);
    }
}


```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/external/v2/log (1 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/external/v2/log/ParameterLogParamV2.java

```java

package org.tkit.onecx.parameters.rs.external.v2.log;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;

import org.tkit.quarkus.log.cdi.LogParam;

import gen.org.tkit.onecx.parameters.rs.v2.model.ParametersBucketDTOV2;

@ApplicationScoped
public class ParameterLogParamV2 implements LogParam {

    @Override
    public List<Item> getClasses() {
        return List.of(
                item(10, ParametersBucketDTOV2.class,
                        x -> x.getClass().getSimpleName() + ":" + ((ParametersBucketDTOV2) x).getInstanceId()));
    }
}


```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/external/v2/mappers (2 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/external/v2/mappers/ExceptionMapperV2.java

```java

package org.tkit.onecx.parameters.rs.external.v2.mappers;

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

import gen.org.tkit.onecx.parameters.rs.v2.model.ProblemDetailInvalidParamDTOV2;
import gen.org.tkit.onecx.parameters.rs.v2.model.ProblemDetailParamDTOV2;
import gen.org.tkit.onecx.parameters.rs.v2.model.ProblemDetailResponseDTOV2;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Mapper(uses = { OffsetDateTimeMapper.class })
public abstract class ExceptionMapperV2 {

    public RestResponse<ProblemDetailResponseDTOV2> constraint(ConstraintViolationException ex) {
        var dto = exception(ErrorKeys.CONSTRAINT_VIOLATIONS.name(), ex.getMessage());
        dto.setInvalidParams(createErrorValidationResponse(ex.getConstraintViolations()));
        return RestResponse.status(Response.Status.BAD_REQUEST, dto);
    }

    @Mapping(target = "removeParamsItem", ignore = true)
    @Mapping(target = "params", ignore = true)
    @Mapping(target = "invalidParams", ignore = true)
    @Mapping(target = "removeInvalidParamsItem", ignore = true)
    public abstract ProblemDetailResponseDTOV2 exception(String errorCode, String detail);

    public List<ProblemDetailParamDTOV2> map(Map<String, Object> params) {
        if (params == null) {
            return List.of();
        }
        return params.entrySet().stream().map(e -> {
            var item = new ProblemDetailParamDTOV2();
            item.setKey(e.getKey());
            if (e.getValue() != null) {
                item.setValue(e.getValue().toString());
            }
            return item;
        }).toList();
    }

    public abstract List<ProblemDetailInvalidParamDTOV2> createErrorValidationResponse(
            Set<ConstraintViolation<?>> constraintViolation);

    @Mapping(target = "name", source = "propertyPath")
    @Mapping(target = "message", source = "message")
    public abstract ProblemDetailInvalidParamDTOV2 createError(ConstraintViolation<?> constraintViolation);

    public String mapPath(Path path) {
        return path.toString();
    }

    public enum ErrorKeys {

        OPTIMISTIC_LOCK,
        CONSTRAINT_VIOLATIONS;
    }
}


```

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/external/v2/mappers/ParameterMapperV2.java

```java

package org.tkit.onecx.parameters.rs.external.v2.mappers;

import java.util.HashMap;
import java.util.Map;

import jakarta.inject.Inject;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.tkit.onecx.parameters.domain.models.History;
import org.tkit.quarkus.rs.mappers.OffsetDateTimeMapper;

import com.fasterxml.jackson.databind.ObjectMapper;

import gen.org.tkit.onecx.parameters.rs.v2.model.ParameterInfoDTOV2;
import gen.org.tkit.onecx.parameters.rs.v2.model.ParametersBucketDTOV2;

@Mapper(uses = OffsetDateTimeMapper.class)
public abstract class ParameterMapperV2 {

    @Inject
    ObjectMapper objectMapper;

    public Map<String, Object> mapParameters(Map<String, String> parameters) {
        Map<String, Object> data = new HashMap<>();
        if (parameters == null) {
            return data;
        }
        try {
            for (Map.Entry<String, String> e : parameters.entrySet()) {
                if (e.getValue() == null || e.getValue().isBlank()) {
                    data.put(e.getKey(), null);
                } else {
                    data.put(e.getKey(), objectMapper.readValue(e.getValue(), Object.class));
                }
            }
        } catch (Exception e) {
            throw new MapperException("Error reading parameter", e);
        }
        return data;
    }

    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "creationUser", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "modificationUser", ignore = true)
    @Mapping(target = "controlTraceabilityManual", ignore = true)
    @Mapping(target = "modificationCount", ignore = true)
    @Mapping(target = "persisted", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "usedValue", source = "dto.currentValue", qualifiedByName = "o2s")
    @Mapping(target = "defaultValue", source = "dto.defaultValue", qualifiedByName = "o2s")
    public abstract History mapItem(ParameterInfoDTOV2 dto, String name, ParametersBucketDTOV2 bucketDTO,
            String productName, String applicationId);

    public static class MapperException extends RuntimeException {

        public MapperException(String msg, Throwable t) {
            super(msg, t);
        }

    }

    @Named("o2s")
    public String o2s(Object value) {
        if (value == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception e) {
            throw new MapperException("Error reading parameter value", e);
        }
    }

}


```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/internal/controllers (2 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/internal/controllers/HistoryRestController.java

```java

package org.tkit.onecx.parameters.rs.internal.controllers;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;

import org.tkit.onecx.parameters.domain.daos.HistoryDAO;
import org.tkit.onecx.parameters.domain.models.History;
import org.tkit.onecx.parameters.domain.services.ParameterService;
import org.tkit.onecx.parameters.rs.internal.mappers.ParameterMapper;
import org.tkit.quarkus.log.cdi.LogService;

import gen.org.tkit.onecx.parameters.rs.internal.HistoriesApi;
import gen.org.tkit.onecx.parameters.rs.internal.model.HistoryCountCriteriaDTO;
import gen.org.tkit.onecx.parameters.rs.internal.model.HistoryCriteriaDTO;

@LogService
@ApplicationScoped
@Transactional(value = Transactional.TxType.NOT_SUPPORTED)
public class HistoryRestController implements HistoriesApi {

    @Inject
    ParameterMapper applicationParameterInternalMapper;

    @Inject
    HistoryDAO historyDAO;

    @Inject
    ParameterService parameterService;

    @Override
    public Response getAllParametersHistoryLatest(HistoryCriteriaDTO criteriaDTO) {
        var pageResult = parameterService.getLatestHistoryEntries(criteriaDTO);
        return Response.ok(pageResult).build();
    }

    @Override
    public Response getAllHistoryProducts() {
        var apps = historyDAO.searchAllProductNamesAndApplicationIds();
        return Response.ok(applicationParameterInternalMapper.apps(apps)).build();
    }

    @Override
    public Response getAllParametersHistory(HistoryCriteriaDTO criteriaDTO) {
        var criteria = applicationParameterInternalMapper.map(criteriaDTO);
        var parametersHistories = historyDAO.searchByCriteria(criteria);
        return Response.ok(applicationParameterInternalMapper.mapHistory(parametersHistories)).build();
    }

    @Override
    public Response getParametersHistoryById(String id) {
        History parameter = historyDAO.findById(id);
        if (parameter == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(applicationParameterInternalMapper.mapHistory(parameter)).build();
    }

    @Override
    public Response getCountsByCriteria(HistoryCountCriteriaDTO criteriaDTO) {
        var criteria = applicationParameterInternalMapper.map(criteriaDTO);
        var counts = historyDAO.searchCountsByCriteria(criteria);
        var results = applicationParameterInternalMapper.mapCountList(counts);
        return Response.ok(results).build();
    }
}


```

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/internal/controllers/ParameterRestController.java

```java

package org.tkit.onecx.parameters.rs.internal.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
import org.tkit.onecx.parameters.domain.daos.ParameterDAO;
import org.tkit.onecx.parameters.domain.models.Parameter;
import org.tkit.onecx.parameters.domain.services.ParameterService;
import org.tkit.onecx.parameters.rs.internal.mappers.ExceptionMapper;
import org.tkit.onecx.parameters.rs.internal.mappers.ParameterMapper;
import org.tkit.quarkus.jpa.exceptions.ConstraintException;
import org.tkit.quarkus.log.cdi.LogService;

import gen.org.tkit.onecx.parameters.rs.internal.ParametersApi;
import gen.org.tkit.onecx.parameters.rs.internal.model.*;

@LogService
@ApplicationScoped
@Transactional(value = Transactional.TxType.NOT_SUPPORTED)
public class ParameterRestController implements ParametersApi {

    @Inject
    ParameterDAO parameterDAO;

    @Inject
    ParameterMapper parameterMapper;

    @Context
    UriInfo uriInfo;

    @Inject
    ExceptionMapper exceptionMapper;

    @Inject
    ParameterService parameterService;

    @Override
    public Response getAllProducts() {
        var apps = parameterDAO.searchAllProductNamesAndApplicationIds();
        return Response.ok(parameterMapper.apps(apps)).build();
    }

    @Override
    public Response getAllNames(String productName, String applicationId) {
        var criteria = parameterMapper.map(productName, applicationId);
        var keys = parameterDAO.searchAllNames(criteria);
        return Response.ok(parameterMapper.names(keys)).build();
    }

    @Override
    public Response searchParametersByCriteria(ParameterSearchCriteriaDTO criteriaDTO) {

        var criteria = parameterMapper.map(criteriaDTO);
        var parameters = parameterDAO.searchByCriteria(criteria);
        ParameterPageResultDTO results = parameterMapper.map(parameters);
        return Response.ok(results).build();
    }

    @Override
    public Response getParameterById(String id) {
        Parameter param = parameterDAO.findById(id);
        if (param == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(exceptionMapper.exception(Response.Status.NOT_FOUND.name(),
                            "Parameter with id" + id + " not found."))
                    .build();
        }
        ParameterDTO parameterDTO = parameterMapper.map(param);
        return Response.ok(parameterDTO).build();
    }

    @Override
    public Response importParameters(ParameterSnapshotDTO request) {
        var productNames = request.getProducts().keySet();
        parameterDAO.findAllByProductNames(productNames);

        Map<String, ImportParameterResponseStatusDTO> items = new HashMap<>();
        List<Parameter> create = new ArrayList<>();
        List<Parameter> update = new ArrayList<>();

        request.getProducts().forEach((productName, dtoList) -> dtoList.forEach(dto -> {
            var singleParameter = parameterDAO.findByNameApplicationIdAndProductName(
                    dto.getName(), dto.getApplicationId(), productName);

            if (singleParameter == null) {
                var parameter = parameterMapper.create(dto);
                create.add(parameter);
                items.put(parameter.getName(), ImportParameterResponseStatusDTO.CREATED);
            } else {
                parameterMapper.update(dto, singleParameter);
                update.add(singleParameter);
                items.put(singleParameter.getName(), ImportParameterResponseStatusDTO.UPDATE);
            }
        }));

        parameterService.importParameters(create, update);

        return Response.ok(parameterMapper.createImportResponse(request, items)).build();
    }

    @Override
    public Response updateParameterValue(String id,
            ParameterUpdateDTO parameterUpdateDTO) {
        Parameter parameter = parameterDAO.findById(id);
        if (parameter == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(exceptionMapper.exception(Response.Status.NOT_FOUND.name(),
                            "Parameter with id" + id + " not found."))
                    .build();
        }
        parameterMapper.update(parameterUpdateDTO, parameter);
        var updatedParameter = parameterMapper.map(parameterDAO.update(parameter));
        return Response.status(Response.Status.OK.getStatusCode()).entity(updatedParameter).build();
    }

    @Override
    public Response createParameter(ParameterCreateDTO request) {

        Parameter param = parameterMapper.create(request);
        param = parameterDAO.create(param);
        return Response
                .created(uriInfo.getAbsolutePathBuilder().path(param.getId()).build())
                .build();
    }

    @Override
    public Response deleteParameter(String id) {
        parameterDAO.deleteQueryById(id);
        return Response.status(Response.Status.NO_CONTENT.getStatusCode()).build();
    }

    @Override
    public Response exportParameters(ExportParameterRequestDTO requestDTO) {
        var parameters = parameterDAO.findAllByProductNames(requestDTO.getProductNames());
        var data = parameters.collect(Collectors.groupingBy(Parameter::getProductName, Collectors.toList()));
        if (data.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(parameterMapper.createSnapshot(data)).build();
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
    public RestResponse<ProblemDetailResponseDTO> daoException(OptimisticLockException ex) {
        return exceptionMapper.optimisticLock(ex);
    }
}


```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/internal/log (1 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/internal/log/ParameterLogParam.java

```java

package org.tkit.onecx.parameters.rs.internal.log;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;

import org.tkit.quarkus.log.cdi.LogParam;

import gen.org.tkit.onecx.parameters.rs.internal.model.*;

@ApplicationScoped
public class ParameterLogParam implements LogParam {

    @Override
    public List<Item> getClasses() {
        return List.of(
                item(10, HistoryCriteriaDTO.class, x -> {
                    HistoryCriteriaDTO d = (HistoryCriteriaDTO) x;
                    return HistoryCriteriaDTO.class.getSimpleName() + "[" + d.getPageNumber() + ","
                            + d.getPageSize()
                            + "]";
                }),
                item(10, HistoryCountCriteriaDTO.class, x -> {
                    HistoryCountCriteriaDTO d = (HistoryCountCriteriaDTO) x;
                    return HistoryCountCriteriaDTO.class.getSimpleName() + "[" + d.getPageNumber() + ","
                            + d.getPageSize()
                            + "]";
                }),
                item(10, ParameterSearchCriteriaDTO.class, x -> {
                    ParameterSearchCriteriaDTO d = (ParameterSearchCriteriaDTO) x;
                    return ParameterSearchCriteriaDTO.class.getSimpleName() + "[" + d.getPageNumber() + "," + d.getPageSize()
                            + "]";
                }),
                item(10, ParameterSnapshotDTO.class, x -> {
                    ParameterSnapshotDTO p = (ParameterSnapshotDTO) x;
                    return ParameterSearchCriteriaDTO.class.getSimpleName() + "[" + p.getId() + "]";
                }),
                item(10, ParameterCreateDTO.class,
                        x -> x.getClass().getSimpleName() + ":" + ((ParameterCreateDTO) x).getName()),
                item(10, ParameterUpdateDTO.class,
                        x -> x.getClass().getSimpleName()));
    }
}


```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/internal/mappers (2 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/internal/mappers/ExceptionMapper.java

```java

package org.tkit.onecx.parameters.rs.internal.mappers;

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

import gen.org.tkit.onecx.parameters.rs.internal.model.ProblemDetailInvalidParamDTO;
import gen.org.tkit.onecx.parameters.rs.internal.model.ProblemDetailParamDTO;
import gen.org.tkit.onecx.parameters.rs.internal.model.ProblemDetailResponseDTO;
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

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/internal/mappers/ParameterMapper.java

```java

package org.tkit.onecx.parameters.rs.internal.mappers;

import java.time.OffsetDateTime;
import java.util.*;

import jakarta.inject.Inject;

import org.mapstruct.*;
import org.tkit.onecx.parameters.domain.criteria.HistorySearchCriteria;
import org.tkit.onecx.parameters.domain.criteria.NamesSearchCriteria;
import org.tkit.onecx.parameters.domain.criteria.ParameterSearchCriteria;
import org.tkit.onecx.parameters.domain.models.*;
import org.tkit.quarkus.jpa.daos.PageResult;
import org.tkit.quarkus.rs.mappers.OffsetDateTimeMapper;

import com.fasterxml.jackson.databind.ObjectMapper;

import gen.org.tkit.onecx.parameters.rs.internal.model.*;

@Mapper(uses = { OffsetDateTimeMapper.class })
public abstract class ParameterMapper {

    @Inject
    ObjectMapper objectMapper;

    @BeanMapping(nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
    public abstract NamesSearchCriteria map(String productName, String applicationId);

    @Mapping(target = "removeStreamItem", ignore = true)
    public abstract NamesPageResultDTO names(PageResult<String> page);

    public List<ProductDTO> apps(List<ApplicationTuple> applicationTuple) {
        Map<String, List<String>> productMap = new HashMap<>();

        for (ApplicationTuple singleApplicationTuple : applicationTuple) {
            productMap
                    .computeIfAbsent(singleApplicationTuple.productName(), k -> new ArrayList<>())
                    .add(singleApplicationTuple.appId());
        }

        List<ProductDTO> products = new ArrayList<>();
        for (Map.Entry<String, List<String>> entry : productMap.entrySet()) {
            products.add(new ProductDTO().productName(entry.getKey()).applications(entry.getValue()));
        }

        return products;
    }

    @BeanMapping(nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
    public abstract HistorySearchCriteria map(HistoryCriteriaDTO criteriaDTO);

    @BeanMapping(nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
    public abstract HistorySearchCriteria map(HistoryCountCriteriaDTO criteriaDTO);

    @BeanMapping(nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
    public abstract ParameterSearchCriteria map(ParameterSearchCriteriaDTO criteriaDTO);

    @Mapping(target = "removeStreamItem", ignore = true)
    public abstract HistoryPageResultDTO mapHistory(PageResult<History> page);

    @Mapping(target = "parameterId", ignore = true)
    @Mapping(target = "defaultValue", source = "defaultValue", qualifiedByName = "s2o")
    @Mapping(target = "usedValue", source = "usedValue", qualifiedByName = "s2o")
    public abstract HistoryDTO mapHistory(History parameterHistory);

    public abstract List<HistoryCountDTO> mapCountList(List<HistoryCountTuple> count);

    @Mapping(target = "removeStreamItem", ignore = true)
    public abstract ParameterPageResultDTO map(PageResult<ParameterSearchResultItemTuple> page);

    @Mapping(target = "value", source = "value", qualifiedByName = "s2o")
    @Mapping(target = "importValue", source = "importValue", qualifiedByName = "s2o")
    @Mapping(target = "isInHistory", ignore = true)
    public abstract ParameterDTO map(Parameter parameter);

    @Mapping(target = "productName", source = "parameter.parameter.productName")
    @Mapping(target = "operator", source = "parameter.parameter.operator")
    @Mapping(target = "name", source = "parameter.parameter.name")
    @Mapping(target = "modificationUser", source = "parameter.parameter.modificationUser")
    @Mapping(target = "modificationDate", source = "parameter.parameter.modificationDate")
    @Mapping(target = "modificationCount", source = "parameter.parameter.modificationCount")
    @Mapping(target = "id", source = "parameter.parameter.id")
    @Mapping(target = "displayName", source = "parameter.parameter.displayName")
    @Mapping(target = "description", source = "parameter.parameter.description")
    @Mapping(target = "creationUser", source = "parameter.parameter.creationUser")
    @Mapping(target = "creationDate", source = "parameter.parameter.creationDate")
    @Mapping(target = "applicationId", source = "parameter.parameter.applicationId")
    @Mapping(target = "isInHistory", source = "parameter.isInHistory")
    @Mapping(target = "value", source = "parameter.parameter.value", qualifiedByName = "s2o")
    @Mapping(target = "importValue", source = "parameter.parameter.importValue", qualifiedByName = "s2o")
    public abstract ParameterDTO map(ParameterSearchResultItemTuple parameter);

    @Named("s2o")
    public Object s2o(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return objectMapper.readValue(value, Object.class);
        } catch (Exception e) {
            throw new MapperException("Error reading parameter value", e);
        }
    }

    @Named("o2s")
    public String o2s(Object value) {
        if (value == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception e) {
            throw new MapperException("Error reading parameter value", e);
        }
    }

    @Mapping(target = "operator", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "value", source = "value", qualifiedByName = "o2s")
    @Mapping(target = "persisted", ignore = true)
    @Mapping(target = "modificationUser", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "modificationCount", source = "modificationCount")
    @Mapping(target = "importValue", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationUser", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "controlTraceabilityManual", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "applicationId", ignore = true)
    @Mapping(target = "productName", ignore = true)
    public abstract void update(ParameterUpdateDTO dto, @MappingTarget Parameter parameter);

    @Mapping(target = "operator", constant = "false")
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "value", source = "value", qualifiedByName = "o2s")
    @Mapping(target = "persisted", ignore = true)
    @Mapping(target = "modificationUser", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "modificationCount", ignore = true)
    @Mapping(target = "importValue", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationUser", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "controlTraceabilityManual", ignore = true)
    public abstract Parameter create(ParameterCreateDTO request);

    @Mapping(target = "modificationUser", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "modificationCount", ignore = true)
    @Mapping(target = "creationUser", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "persisted", ignore = true)
    @Mapping(target = "controlTraceabilityManual", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "value", source = "value", qualifiedByName = "o2s")
    @Mapping(target = "importValue", source = "importValue", qualifiedByName = "o2s")
    @Mapping(target = "operator", constant = "false")
    public abstract Parameter create(EximParameterDTO dto);

    public abstract List<Parameter> create(List<EximParameterDTO> dto);

    @Mapping(target = "modificationUser", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "modificationCount", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationUser", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "persisted", ignore = true)
    @Mapping(target = "controlTraceabilityManual", ignore = true)
    @Mapping(target = "value", source = "value", qualifiedByName = "o2s")
    @Mapping(target = "importValue", source = "importValue", qualifiedByName = "o2s")
    @Mapping(target = "operator", constant = "false")
    public abstract void update(EximParameterDTO dto, @MappingTarget Parameter parameter);

    @Mapping(target = "id", source = "request.id")
    @Mapping(target = "parameters", source = "parameters")
    @Mapping(target = "removeParametersItem", ignore = true)
    public abstract ImportParameterResponseDTO createImportResponse(ParameterSnapshotDTO request,
            Map<String, ImportParameterResponseStatusDTO> parameters);

    public static class MapperException extends RuntimeException {

        public MapperException(String msg, Throwable t) {
            super(msg, t);
        }

    }

    public ParameterSnapshotDTO createSnapshot(Map<String, List<Parameter>> data) {
        if (data == null) {
            return null;
        }

        ParameterSnapshotDTO result = new ParameterSnapshotDTO();
        result.setId(UUID.randomUUID().toString());
        result.setCreated(OffsetDateTime.now());
        result.setProducts(map(data));
        return result;
    }

    public Map<String, List<EximParameterDTO>> map(Map<String, List<Parameter>> data) {
        if (data == null) {
            return Map.of();
        }

        Map<String, List<EximParameterDTO>> map = new HashMap<>();
        data.forEach((name, value) -> {
            List<EximParameterDTO> dto = maps(value);
            map.put(name, dto);
        });
        return map;
    }

    public abstract List<EximParameterDTO> maps(List<Parameter> value);
}


```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/operator/v1/controllers (1 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/operator/v1/controllers/OperatorParameterRestControllerV1.java

```java

package org.tkit.onecx.parameters.rs.operator.v1.controllers;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;

import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;
import org.tkit.onecx.parameters.domain.services.ParameterService;
import org.tkit.onecx.parameters.rs.operator.v1.mappers.OperatorExceptionMapperV1;
import org.tkit.onecx.parameters.rs.operator.v1.mappers.OperatorParameterMapperV1;
import org.tkit.quarkus.log.cdi.LogService;

import gen.org.tkit.onecx.parameters.rs.v1.model.ProblemDetailResponseDTOV1;
import gen.org.tkit.onecx.parameters.rs.v1.operator.OperatorParametersApi;
import gen.org.tkit.onecx.parameters.rs.v1.operator.model.ParametersUpdateRequestOperatorDTOV1;

@LogService
@ApplicationScoped
@Transactional(value = Transactional.TxType.NOT_SUPPORTED)
public class OperatorParameterRestControllerV1 implements OperatorParametersApi {

    @Inject
    ParameterService service;

    @Inject
    OperatorParameterMapperV1 mapper;

    @Inject
    OperatorExceptionMapperV1 exceptionMapper;

    @ServerExceptionMapper
    public RestResponse<ProblemDetailResponseDTOV1> constraint(ConstraintViolationException ex) {
        return exceptionMapper.constraint(ex);
    }

    @Override
    public Response createOrUpdateParameterValue(String productName, String applicationId,
            ParametersUpdateRequestOperatorDTOV1 dto) {
        var params = mapper.create(productName, applicationId, dto);
        service.operatorImportParameters(productName, applicationId, params);
        return Response.noContent().build();
    }
}


```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/operator/v1/log (1 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/operator/v1/log/OperatorParameterLogParamV1.java

```java

package org.tkit.onecx.parameters.rs.operator.v1.log;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;

import org.tkit.quarkus.log.cdi.LogParam;

import gen.org.tkit.onecx.parameters.rs.v1.operator.model.ParametersUpdateRequestOperatorDTOV1;

@ApplicationScoped
public class OperatorParameterLogParamV1 implements LogParam {

    @Override
    public List<Item> getClasses() {
        return List.of(
                item(10, ParametersUpdateRequestOperatorDTOV1.class,
                        x -> ParametersUpdateRequestOperatorDTOV1.class.getSimpleName() + "["
                                + ((ParametersUpdateRequestOperatorDTOV1) x).getParameters().size() + "]"));
    }
}


```

## Folder: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/operator/v1/mappers (2 files)

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/operator/v1/mappers/OperatorExceptionMapperV1.java

```java

package org.tkit.onecx.parameters.rs.operator.v1.mappers;

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

import gen.org.tkit.onecx.parameters.rs.v1.model.ProblemDetailInvalidParamDTOV1;
import gen.org.tkit.onecx.parameters.rs.v1.model.ProblemDetailParamDTOV1;
import gen.org.tkit.onecx.parameters.rs.v1.model.ProblemDetailResponseDTOV1;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Mapper(uses = { OffsetDateTimeMapper.class })
public abstract class OperatorExceptionMapperV1 {

    public RestResponse<ProblemDetailResponseDTOV1> constraint(ConstraintViolationException ex) {
        var dto = exception(ErrorKeys.CONSTRAINT_VIOLATIONS.name(), ex.getMessage());
        dto.setInvalidParams(createErrorValidationResponse(ex.getConstraintViolations()));
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

### File: onecx-parameter-svc/src/main/java/org/tkit/onecx/parameters/rs/operator/v1/mappers/OperatorParameterMapperV1.java

```java

package org.tkit.onecx.parameters.rs.operator.v1.mappers;

import java.util.List;

import jakarta.inject.Inject;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.tkit.onecx.parameters.domain.models.Parameter;
import org.tkit.onecx.parameters.rs.internal.mappers.ParameterMapper;
import org.tkit.quarkus.rs.mappers.OffsetDateTimeMapper;

import com.fasterxml.jackson.databind.ObjectMapper;

import gen.org.tkit.onecx.parameters.rs.v1.operator.model.ParameterUpdateRequestOperatorDTOV1;
import gen.org.tkit.onecx.parameters.rs.v1.operator.model.ParametersUpdateRequestOperatorDTOV1;

@Mapper(uses = OffsetDateTimeMapper.class)
public abstract class OperatorParameterMapperV1 {

    @Inject
    ObjectMapper objectMapper;

    public List<Parameter> create(String productName, String applicationId, ParametersUpdateRequestOperatorDTOV1 request) {
        if (request == null || request.getParameters() == null) {
            return List.of();
        }
        return request.getParameters().stream().map(x -> createParam(productName, applicationId, x)).toList();
    }

    @Mapping(target = "operator", constant = "true")
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "importValue", source = "request.value", qualifiedByName = "o2s")
    @Mapping(target = "value", ignore = true)
    @Mapping(target = "persisted", ignore = true)
    @Mapping(target = "modificationUser", ignore = true)
    @Mapping(target = "modificationDate", ignore = true)
    @Mapping(target = "modificationCount", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationUser", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "controlTraceabilityManual", ignore = true)
    public abstract Parameter createParam(String productName, String applicationId,
            ParameterUpdateRequestOperatorDTOV1 request);

    @Named("o2s")
    public String o2s(Object value) {
        if (value == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception e) {
            throw new ParameterMapper.MapperException("Error reading parameter value", e);
        }
    }
}


```

## Folder: onecx-parameter-svc/src/main/openapi (3 files)

### File: onecx-parameter-svc/src/main/openapi/onecx-parameter-bff-v1.yaml

```yaml

---
openapi: 3.0.3
info:
 title: onecx-parameters external bff service V1
 description: This API provides endpoints for the onecx-shell-bff to retrieve parameters
 version: "2.0"
servers:
 - url: http://onecx-parameters-svc:8080/
tags:
 - name: parametersBff
   description: Retrieve Parameters
paths:
 /bff/v1/parameters:
  post:
   security:
    - oauth2: [ ocx-pa-ext:read ]
   tags:
    - parametersBff
   description: Find all parameters by product names and appIds
   operationId: getParametersByProductsAndAppIds
   requestBody:
    required: true
    content:
     application/json:
      schema:
       $ref: '#/components/schemas/ParametersBulkRequest'
   responses:
    "200":
     description: Parameters retrieved successfully
     content:
      application/json:
       schema:
        $ref: '#/components/schemas/ParametersBulkResponse'
components:
 securitySchemes:
  oauth2:
   type: oauth2
   flows:
    clientCredentials:
     tokenUrl: https://oauth.simple.api/token
     scopes:
      ocx-pa-ext:read: Grants access to all operations
 schemas:
  ParametersBulkRequest:
   type: object
   required:
    - products
   properties:
    products:
     type: object
     additionalProperties:
      uniqueItems: true
      type: array
      items:
       type: string
  ParametersBulkResponse:
   type: object
   properties:
    products:
     type: object
     additionalProperties:
      type: object
      additionalProperties:
       type: array
       items:
        $ref: '#/components/schemas/Parameter'
  Parameter:
   type: object
   properties:
    displayName:
     type: string
    description:
     type: string
    applicationId:
     type: string
    productName:
     type: string
    name:
     type: string
    value:
     type: object
    importValue:
     type: object
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

### File: onecx-parameter-svc/src/main/openapi/onecx-parameter-internal.yaml

```yaml

---
openapi: 3.0.3
info:
  title: onecx-parameters internal service
  description: This API provides endpoints to manage Parameters and Histories
  version: "2.0"
servers:
- url: http://onecx-parameters-svc:8080/
tags:
- name: histories
  description: Managing Histories
- name: parameters
  description: Managing Parameters
paths:
  /histories:
    post:
      security:
        - oauth2: [ ocx-pa:all, ocx-pa:read ]
      tags:
      - histories
      description: Find all parameters histories
      operationId: getAllParametersHistory
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HistoryCriteria'
      responses:
        "200":
          description: Parameter histories retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HistoryPageResult'
  /histories/counts:
    post:
      security:
        - oauth2: [ ocx-pa:all, ocx-pa:read ]
      tags:
      - histories
      description: Get creation dates and counts of histories by criteria
      operationId: getCountsByCriteria
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HistoryCountCriteria'
      responses:
        "200":
          description: History counts retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/HistoryCount'
  /histories/latest:
    post:
      security:
        - oauth2: [ ocx-pa:all, ocx-pa:read ]
      tags:
      - histories
      description: Find all latest parameters history entries
      operationId: getAllParametersHistoryLatest
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HistoryCriteria'
      responses:
        "200":
          description: History retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HistoryPageResult'
  /histories/{id}:
    get:
      security:
        - oauth2: [ ocx-pa:all, ocx-pa:read ]
      tags:
      - histories
      description: Find parameters history by its id
      operationId: getParametersHistoryById
      parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
      responses:
        "200":
          description: History retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/History'
        "404":
          description: History not Found
  /histories/products:
    get:
      security:
        - oauth2: [ ocx-pa:all, ocx-pa:read ]
      tags:
        - histories
      description: Find all products for which histories exists
      operationId: getAllHistoryProducts
      responses:
        "200":
          description: Products retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'
        "400":
          description: Bad request
  /parameters/search:
    post:
      security:
        - oauth2: [ ocx-pa:all, ocx-pa:read ]
      tags:
        - parameters
      description: Search for parameters by search criteria
      operationId: searchParametersByCriteria
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ParameterSearchCriteria'
      responses:
        "200":
          description: Parameter search results retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ParameterPageResult'
        "400":
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
  /parameters:
    post:
      security:
        - oauth2: [ ocx-pa:all, ocx-pa:write ]
      tags:
      - parameters
      description: Create a new parameter
      operationId: createParameter
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ParameterCreate'
      responses:
        "204":
          description: Parameter created successfully
        "400":
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
        "404":
          description: Not Found
  /parameters/products:
    get:
      security:
        - oauth2: [ ocx-pa:all, ocx-pa:read ]
      tags:
      - parameters
      description: Find all products to which parameters are assigned
      operationId: getAllProducts
      responses:
        "200":
          description: Products retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'
        "400":
          description: Bad request
  /parameters/names/{productName}:
    get:
      security:
        - oauth2: [ ocx-pa:all, ocx-pa:read ]
      tags:
      - parameters
      description: Find all parameters names for a specific product by its name
      operationId: getAllNames
      parameters:
      - name: applicationId
        in: query
        schema:
          description: The application id.
          type: string
      - name: productName
        required: true
        in: path
        schema:
          description: The product name.
          type: string
      responses:
        "200":
          description: Parameters retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/NamesPageResult'
        "400":
          description: Bad request
  /parameters/{id}:
    get:
      security:
        - oauth2: [ ocx-pa:all, ocx-pa:read ]
      tags:
      - parameters
      description: Get a parameter by its id
      operationId: getParameterById
      parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
      responses:
        "200":
          description: Parameter retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Parameter'
        "400":
          description: Bad request
        "404":
          description: Parameter not Found
    put:
      security:
        - oauth2: [ ocx-pa:all, ocx-pa:write ]
      tags:
      - parameters
      description: Update a parameter by its id
      operationId: updateParameterValue
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
              $ref: '#/components/schemas/ParameterUpdate'
      responses:
        "200":
          description: Parameter updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Parameter'
        "400":
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
        "404":
          description: Parameter not Found
    delete:
      security:
        - oauth2: [ ocx-pa:all, ocx-pa:delete ]
      tags:
      - parameters
      description: Delete a parameter by its id
      operationId: deleteParameter
      parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
      responses:
        "204":
          description: Parameter deleted successfully
        "400":
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
  /parameters/export:
    post:
      security:
        - oauth2: [ ocx-pa:all, ocx-pa:read ]
      tags:
        - parameters
      description: Export parameters
      operationId: exportParameters
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExportParameterRequest'
      responses:
        "200":
          description: Parameters exported successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ParameterSnapshot'
        "404":
          description: Parameters not found
  /parameters/import:
    post:
      security:
        - oauth2: [ ocx-pa:all, ocx-pa:write ]
      tags:
        - parameters
      description: Import parameters
      operationId: importParameters
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ParameterSnapshot'
      responses:
        "200":
          description: Parameters imported successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ImportParameterResponse'
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
            ocx-pa:all: Grants access to all operations
            ocx-pa:read: Grants read access
            ocx-pa:write: Grants write access
            ocx-pa:delete: Grants access to delete operations
  schemas:
    ExportParameterRequest:
      type: object
      properties:
        productNames:
          type: array
          uniqueItems: true
          items:
            type: string
    ParameterSnapshot:
      type: object
      properties:
        id:
          type: string
          minLength: 10
          description: ID of the request
        created:
          $ref: '#/components/schemas/OffsetDateTime'
        products:
          type: object
          nullable: false
          additionalProperties:
            type: array
            items:
              $ref: '#/components/schemas/EximParameter'
    ImportParameterResponse:
      type: object
      properties:
        id:
          type: string
          minLength: 10
          description: ID of the request
        parameters:
          additionalProperties:
            $ref: '#/components/schemas/ImportParameterResponseStatus'
    ImportParameterResponseStatus:
      type: string
      enum:
        - UPDATE
        - CREATED
        - SKIP
    ParameterCreate:
      type: object
      properties:
        name:
          type: string
        displayName:
          type: string
        applicationId:
          type: string
        productName:
          type: string
        value:
          type: object
        description:
          type: string
    Parameter:
      type: object
      properties:
        id:
          type: string
        modificationCount:
          format: int32
          type: integer
        creationDate:
          format: date-time
          type: string
          example: 2022-03-10T12:15:50-04:00
        creationUser:
          type: string
        modificationDate:
          format: date-time
          type: string
          example: 2022-03-10T12:15:50-04:00
        modificationUser:
          type: string
        displayName:
          type: string
        description:
          type: string
        applicationId:
          type: string
        productName:
          type: string
        name:
          type: string
        value:
          type: object
        importValue:
          type: object
        operator:
          type: boolean
        isInHistory:
          type: boolean
    EximParameter:
      type: object
      properties:
        displayName:
          type: string
        description:
          type: string
        applicationId:
          type: string
        productName:
          type: string
        name:
          type: string
        value:
          type: object
        importValue:
          type: object
        operator:
          type: boolean
    History:
      type: object
      properties:
        id:
          type: string
        modificationCount:
          format: int32
          type: integer
        creationDate:
          format: date-time
          type: string
          example: 2022-03-10T12:15:50-04:00
        creationUser:
          type: string
        modificationDate:
          format: date-time
          type: string
          example: 2022-03-10T12:15:50-04:00
        modificationUser:
          type: string
        applicationId:
          type: string
        productName:
          type: string
        name:
          type: string
        usedValue:
          type: object
        defaultValue:
          type: object
        instanceId:
          type: string
        count:
          type: integer
          format: int64
        start:
          format: date-time
          type: string
          example: 2022-03-10T12:15:50-04:00
        end:
          format: date-time
          type: string
          example: 2022-03-10T12:15:50-04:00
        parameterId:
          type: string
    HistoryCriteria:
      type: object
      properties:
        applicationId:
          type: string
        productName:
          type: string
        name:
          type: string
        pageNumber:
          type: integer
          format: int32
          default: 0
        pageSize:
          type: integer
          format: int32
          default: 100
    HistoryPageResult:
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
            $ref: '#/components/schemas/History'
    ParameterPageResult:
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
            $ref: '#/components/schemas/Parameter'
    ParameterUpdate:
      type: object
      required:
        - modificationCount
      properties:
        value:
          type: object
        displayName:
          type: string
        description:
          type: string
        modificationCount:
          format: int32
          type: integer
    Product:
      type: object
      properties:
        productName:
          type: string
        applications:
          type: array
          items:
            type: string
    NamesPageResult:
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
            type: string
    HistoryCountCriteria:
      type: object
      properties:
        applicationId:
          type: string
        productName:
          type: string
        name:
          type: string
        pageNumber:
          format: int32
          default: 0
          type: integer
        pageSize:
          format: int32
          default: 100
          type: integer
        type:
          type: array
          items:
            type: string
    HistoryCount:
      type: object
      properties:
        creationDate:
          format: date-time
          type: string
          example: 2022-03-10T12:15:50
        count:
          format: int64
          type: integer
    ParameterSearchCriteria:
      type: object
      properties:
        applicationId:
          type: string
        productName:
          type: string
        name:
          type: string
        pageNumber:
          format: int32
          description: The number of page
          default: 0
          type: integer
        pageSize:
          format: int32
          description: The size of page
          default: 100
          type: integer
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

```

### File: onecx-parameter-svc/src/main/openapi/onecx-parameter-operator-v1.yaml

```yaml

---
openapi: 3.0.3
info:
  title: onecx-parameters operator service V1
  description: This API provides endpoints to create and update parameters by the onecx-parameter-operator only
  version: "1.0.0"
servers:
- url: http://onecx-parameters-svc:8080/
tags:
- name: operatorParameters
  description: Create and Update Parameters by the Operator
paths:
  /operator/v1/parameters/{productName}/{applicationId}:
    put:
      security:
        - oauth2: [ ocx-pa-op:write ]
      tags:
      - operatorParameters
      description: Create or update a parameter by product name and application id
      operationId: createOrUpdateParameterValue
      parameters:
        - in: path
          name: productName
          schema:
            type: string
          required: true
        - in: path
          name: applicationId
          schema:
            type: string
          required: true
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ParametersUpdateRequest'
      responses:
        "204":
          description: Parameter created or updated successfully
        "400":
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetailResponse'
        "404":
          description: Not Found
components:
  securitySchemes:
    oauth2:
      type: oauth2
      flows:
        clientCredentials:
          tokenUrl: https://oauth.simple.api/token
          scopes:
            ocx-pa-op:write: Grants write access
  schemas:
    ParametersUpdateRequest:
      type: object
      properties:
        parameters:
          type: array
          minItems: 1
          items:
            $ref: '#/components/schemas/ParameterUpdateRequest'
    ParameterUpdateRequest:
      type: object
      required:
        - name
        - value
      properties:
        name:
          type: string
        displayName:
          type: string
        value:
          type: object
        description:
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

## Folder: onecx-parameter-svc/src/main/resources (1 files)

### File: onecx-parameter-svc/src/main/resources/application.properties

```properties

# DEFAULT
quarkus.datasource.db-kind=postgresql
quarkus.datasource.jdbc.max-size=30
quarkus.datasource.jdbc.min-size=10
quarkus.datasource.metrics.enabled=true
quarkus.hibernate-orm.metrics.enabled=true
quarkus.hibernate-orm.jdbc.timezone=UTC
quarkus.hibernate-orm.log.sql=false

quarkus.http.auth.permission.health.paths=/q/*
quarkus.http.auth.permission.health.policy=permit
quarkus.http.auth.permission.default.paths=/*
quarkus.http.auth.permission.default.policy=authenticated

quarkus.hibernate-orm.database.generation=validate
quarkus.hibernate-orm.multitenant=DISCRIMINATOR

quarkus.liquibase.migrate-at-start=true
quarkus.liquibase.validate-on-migrate=true

onecx.parameter.scheduler.expression=0 15 2 * * ?
onecx.parameter.scheduler.duration=7

# OIDC
%prod.quarkus.oidc-client.client-id=${quarkus.application.name}

# enable or disable multi-tenancy support
tkit.rs.context.tenant-id.enabled=true
tkit.jpa.tenant.root.enabled=true
# TEST
%test.quarkus.scheduler.enabled=false

%test.tkit.jpa.tenant.default=tenant-100
%test.onecx.tenant.service.client.url=${quarkus.mockserver.endpoint}
%test.smallrye.jwt.verify.key.location=${keycloak.url}/realms/quarkus/protocol/openid-connect/certs
%test.tkit.rs.context.token.header-param=apm-principal-token
%test.quarkus.oidc-client.client-id=${quarkus.oidc.client-id}

%test.tkit.log.json.enabled=false
%test.quarkus.mockserver.devservices.log=false

# TEST-IT
quarkus.test.integration-test-profile=test
quarkus.test.enable-callbacks-for-integration-tests=true

# PROD
%prod.quarkus.datasource.jdbc.url=${DB_URL:jdbc:postgresql://postgresdb:5432/onecx-parameter?sslmode=disable}
%prod.quarkus.datasource.username=${DB_USER:onecx-parameter}
%prod.quarkus.datasource.password=${DB_PWD:onecx-parameter}


```

## Folder: onecx-parameter-svc/src/main/resources/db (1 files)

### File: onecx-parameter-svc/src/main/resources/db/changeLog.xml

```xml

<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
                        http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd">

        <include relativeToChangelogFile="true" file="v1/2024-12-16-create-tables.xml"/>
        <include relativeToChangelogFile="true" file="v1/2025-01-06-operator-flag-and-idx.xml"/>
        <include relativeToChangelogFile="true" file="v1/2025-01-07-remove-type-add-desc.xml"/>
        <include relativeToChangelogFile="true" file="v1/2025-03-31-remove-desc.xml"/>
</databaseChangeLog>


```

## Folder: onecx-parameter-svc/src/main/resources/db/v1 (4 files)

### File: onecx-parameter-svc/src/main/resources/db/v1/2024-12-16-create-tables.xml

```xml

<?xml version="1.1" encoding="UTF-8" standalone="no"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd"
                   objectQuotingStrategy="QUOTE_ONLY_RESERVED_WORDS">

    <changeSet author="dev (generated)" id="1734359522399-1">
        <createTable tableName="history">
            <column name="optlock" type="INTEGER">
                <constraints nullable="false"/>
            </column>
            <column name="count" type="BIGINT"/>
            <column name="interval_end" type="TIMESTAMP WITHOUT TIME ZONE"/>
            <column name="interval_start" type="TIMESTAMP WITHOUT TIME ZONE"/>
            <column name="creationdate" type="TIMESTAMP WITHOUT TIME ZONE"/>
            <column name="modificationdate" type="TIMESTAMP WITHOUT TIME ZONE"/>
            <column name="app_id" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="default_value" type="VARCHAR(5000)"/>
            <column name="guid" type="VARCHAR(255)">
                <constraints nullable="false" primaryKey="true" primaryKeyName="history_pkey"/>
            </column>
            <column name="instance_id" type="VARCHAR(255)"/>
            <column name="name" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="product_name" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="tenant_id" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="used_value" type="VARCHAR(5000)"/>
            <column name="value_type" type="VARCHAR(255)"/>
            <column name="creationuser" type="VARCHAR(255)"/>
            <column name="modificationuser" type="VARCHAR(255)"/>
        </createTable>
    </changeSet>
    <changeSet author="dev (generated)" id="1734359522399-2">
        <createTable tableName="parameter">
            <column name="optlock" type="INTEGER">
                <constraints nullable="false"/>
            </column>
            <column name="creationdate" type="TIMESTAMP WITHOUT TIME ZONE"/>
            <column name="modificationdate" type="TIMESTAMP WITHOUT TIME ZONE"/>
            <column name="app_id" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="description" type="VARCHAR(255)"/>
            <column name="guid" type="VARCHAR(255)">
                <constraints nullable="false" primaryKey="true" primaryKeyName="parameter_pkey"/>
            </column>
            <column name="import_value" type="VARCHAR(5000)"/>
            <column name="name" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="display_name" type="VARCHAR(255)"/>
            <column name="product_name" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="tenant_id" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="value" type="VARCHAR(5000)"/>
            <column name="creationuser" type="VARCHAR(255)"/>
            <column name="modificationuser" type="VARCHAR(255)"/>
        </createTable>
    </changeSet>
    <changeSet author="dev (generated)" id="1734359522399-4">
        <addUniqueConstraint columnNames="name, app_id, product_name, tenant_id" constraintName="parameter_constraint" tableName="parameter"/>
    </changeSet>
    <changeSet author="dev (generated)" id="1734359522399-5">
        <createTable tableName="job">
            <column name="optlock" type="INTEGER">
                <constraints nullable="false"/>
            </column>
            <column name="creationdate" type="TIMESTAMP WITHOUT TIME ZONE"/>
            <column name="modificationdate" type="TIMESTAMP WITHOUT TIME ZONE"/>
            <column name="guid" type="VARCHAR(255)">
                <constraints nullable="false" primaryKey="true" primaryKeyName="job_pkey"/>
            </column>
            <column name="creationuser" type="VARCHAR(255)"/>
            <column name="modificationuser" type="VARCHAR(255)"/>
        </createTable>
        <insert tableName="job">
            <column  name="guid"  value="maintenance.history"/>
            <column  name="optlock"  value="1"/>
        </insert>
    </changeSet>
</databaseChangeLog>


```

### File: onecx-parameter-svc/src/main/resources/db/v1/2025-01-06-operator-flag-and-idx.xml

```xml

<?xml version="1.1" encoding="UTF-8" standalone="no"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd"
                   objectQuotingStrategy="QUOTE_ONLY_RESERVED_WORDS">
    <changeSet author="dev (generated)" id="1736154869027-1">
        <addColumn tableName="parameter">
            <column name="operator" type="BOOLEAN"/>
        </addColumn>

        <createIndex indexName="idx_history_v1" tableName="history">
            <column name="product_name"/>
            <column name="app_id"/>
            <column name="tenant_id"/>
        </createIndex>
        <createIndex indexName="idx_parameter_v1" tableName="parameter">
            <column name="product_name"/>
            <column name="app_id"/>
            <column name="tenant_id"/>
        </createIndex>
    </changeSet>
</databaseChangeLog>

```

### File: onecx-parameter-svc/src/main/resources/db/v1/2025-01-07-remove-type-add-desc.xml

```xml

<?xml version="1.1" encoding="UTF-8" standalone="no"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd"
                   objectQuotingStrategy="QUOTE_ONLY_RESERVED_WORDS">
    <changeSet author="dev (generated)" id="1736255261839-1">
        <addColumn tableName="history">
            <column name="value_description" type="VARCHAR(255)"/>
        </addColumn>
        <dropColumn columnName="value_type" tableName="history"/>
    </changeSet>
</databaseChangeLog>

```

### File: onecx-parameter-svc/src/main/resources/db/v1/2025-03-31-remove-desc.xml

```xml

<?xml version="1.1" encoding="UTF-8" standalone="no"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd"
                   objectQuotingStrategy="QUOTE_ONLY_RESERVED_WORDS">
    <changeSet author="dev (generated)" id="1743423487313-1">
        <dropColumn columnName="value_description" tableName="history"/>
    </changeSet>
</databaseChangeLog>

```

## Folder: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/domain/daos (3 files)

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/domain/daos/JobDAOExceptionTest.java

```java

package org.tkit.onecx.parameters.domain.daos;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.tkit.quarkus.jpa.exceptions.DAOException;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
class JobDAOExceptionTest {
    @Inject
    JobDAO dao;

    @InjectMock
    EntityManager em;

    @BeforeEach
    void beforeAll() {
        Mockito.when(em.getCriteriaBuilder()).thenThrow(new RuntimeException("Test technical error exception"));
    }

    @Test
    void findApplicationParametersByKeysTest() {
        var exc = Assertions.assertThrows(DAOException.class, () -> dao.getJob("test"));
        Assertions.assertEquals(JobDAO.Error.GET_JOB_FAILED, exc.key);
    }

}


```

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/domain/daos/ParameterDAOExceptionTest.java

```java

package org.tkit.onecx.parameters.domain.daos;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.mockito.Mockito;
import org.tkit.quarkus.jpa.exceptions.DAOException;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
class ParameterDAOExceptionTest {

    @Inject
    ParameterDAO dao;

    @InjectMock
    EntityManager em;

    @BeforeEach
    void beforeAll() {
        Mockito.when(em.getCriteriaBuilder()).thenThrow(new RuntimeException("Test technical error exception"));
    }

    @Test
    void test() {
        test(ParameterDAO.ErrorKeys.FIND_ALL_PARAMETERS_BY_APPLICATION_ID_FAILED,
                () -> dao.findAllByProductNameAndApplicationId(null, null));
        test(ParameterDAO.ErrorKeys.FIND_ALL_PARAMETERS_VALUES_BY_APPLICATION_ID_FAILED,
                () -> dao.findAllValuesByProductNameAndApplicationId(null, null));
        test(ParameterDAO.ErrorKeys.FIND_ALL_PARAMETERS_FAILED, () -> dao.searchByCriteria(null));
        test(ParameterDAO.ErrorKeys.FIND_ALL_APPLICATIONS_FAILED, () -> dao.searchAllProductNamesAndApplicationIds());
        test(ParameterDAO.ErrorKeys.FIND_ALL_NAMES_FAILED, () -> dao.searchAllNames(null));
        test(ParameterDAO.ErrorKeys.FIND_ALL_PARAMETERS_BY_PRODUCT_NAMES_FAILED, () -> dao.findAllByProductNames(null));
        test(ParameterDAO.ErrorKeys.FIND_BY_NAME_PRODUCT_NAME_APPLICATION_ID_FAILED,
                () -> dao.findByNameApplicationIdAndProductName(null, null, null));
        test(ParameterDAO.ErrorKeys.FIND_ALL_PARAMETERS_BY_PRODUCT_NAMES_AND_APP_IDS_FAILED,
                () -> dao.findAllByProductNamesAndApplicationIds(null));
    }

    private void test(Enum<?> key, Executable executable) {
        var exc = Assertions.assertThrows(DAOException.class, executable);
        Assertions.assertEquals(key, exc.key);
    }

}


```

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/domain/daos/ParameterHistoryDAOExceptionTest.java

```java

package org.tkit.onecx.parameters.domain.daos;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.tkit.quarkus.jpa.exceptions.DAOException;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
class ParameterHistoryDAOExceptionTest {

    @Inject
    HistoryDAO dao;

    @InjectMock
    EntityManager em;

    @BeforeEach
    void beforeAll() {
        Mockito.when(em.getCriteriaBuilder()).thenThrow(new RuntimeException("Test technical error exception"));
    }

    @Test
    void searchByCriteriaTest() {
        var exc = Assertions.assertThrows(DAOException.class, () -> dao.searchByCriteria(null));
        Assertions.assertEquals(HistoryDAO.ErrorKeys.FIND_ALL_PARAMETERS_HISTORY_FAILED,
                exc.key);
    }

    @Test
    void searchOnlyLatestByCriteriaTest() {
        var exc = Assertions.assertThrows(DAOException.class, () -> dao.searchOnlyLatestByCriteria(null));
        Assertions.assertEquals(HistoryDAO.ErrorKeys.FIND_ALL_PARAMETERS_HISTORY_FAILED,
                exc.key);
    }

    @Test
    void searchCountsByCriteriaTest() {
        var exc = Assertions.assertThrows(DAOException.class, () -> dao.searchCountsByCriteria(null));
        Assertions.assertEquals(HistoryDAO.ErrorKeys.FIND_ALL_PARAMETERS_HISTORY_FAILED,
                exc.key);
    }

    @Test
    void searchAllApplicationsTest() {
        var exc = Assertions.assertThrows(DAOException.class, () -> dao.searchAllProductNamesAndApplicationIds());
        Assertions.assertEquals(HistoryDAO.ErrorKeys.FIND_ALL_APPLICATIONS_FAILED,
                exc.key);
    }
}


```

## Folder: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/domain/timer (2 files)

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/domain/timer/MaintenanceHistoryServiceExceptionTest.java

```java

package org.tkit.onecx.parameters.domain.timer;

import static org.tkit.onecx.parameters.domain.timer.MaintenanceHistoryService.JOB_ID;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.tkit.onecx.parameters.domain.daos.HistoryDAO;
import org.tkit.onecx.parameters.domain.daos.JobDAO;
import org.tkit.onecx.parameters.domain.models.Job;
import org.tkit.quarkus.jpa.exceptions.DAOException;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
class MaintenanceHistoryServiceExceptionTest {

    @Inject
    MaintenanceHistoryService service;

    @InjectMock
    EntityManager em;

    @InjectMock
    JobDAO dao;

    @BeforeEach
    void beforeAll() {
        Mockito.when(dao.getJob(JOB_ID)).thenReturn(new Job());
        Mockito.when(em.getCriteriaBuilder())
                .thenThrow(new RuntimeException("Test technical error exception"));
    }

    @Test
    void testDaoException() {
        var exc = Assertions.assertThrows(DAOException.class, () -> {
            service.maintenanceHistoryData();
        });
        Assertions.assertEquals(HistoryDAO.ErrorKeys.DELETE_PARAMETER_HISTORY_OLDER_THAN_FAILED, exc.key);
    }

}


```

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/domain/timer/MaintenanceHistoryServiceTest.java

```java

package org.tkit.onecx.parameters.domain.timer;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.mockserver.model.HttpRequest.request;
import static org.mockserver.model.HttpResponse.response;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.inject.Inject;
import jakarta.ws.rs.HttpMethod;
import jakarta.ws.rs.core.Response;

import org.eclipse.microprofile.config.Config;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.mockserver.client.MockServerClient;
import org.mockserver.model.JsonBody;
import org.mockserver.model.MediaType;
import org.tkit.onecx.parameters.domain.daos.HistoryDAO;
import org.tkit.onecx.parameters.domain.daos.JobDAO;
import org.tkit.onecx.parameters.domain.models.History;
import org.tkit.onecx.parameters.test.AbstractTest;
import org.tkit.quarkus.jpa.tenant.ContextTenantResolverConfig;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;
import org.tkit.quarkus.test.WithDBData;

import gen.org.tkit.onecx.parameters.rs.internal.model.HistoryCriteriaDTO;
import gen.org.tkit.onecx.parameters.rs.internal.model.HistoryPageResultDTO;
import gen.org.tkit.onecx.tenant.client.model.TenantId;
import io.quarkiverse.mockserver.test.InjectMockServerClient;
import io.quarkus.test.InjectMock;
import io.quarkus.test.Mock;
import io.quarkus.test.junit.QuarkusTest;
import io.smallrye.config.SmallRyeConfig;

@QuarkusTest
@WithDBData(value = { "data/history-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-pa:read", "ocx-pa:write", "ocx-pa:delete",
        "ocx-pa:all" })
class MaintenanceHistoryServiceTest extends AbstractTest {

    @InjectMockServerClient
    MockServerClient mockServerClient;

    @Inject
    MaintenanceHistoryService service;

    @Inject
    HistoryDAO dao;

    @Inject
    JobDAO jobDAO;

    @InjectMock
    ContextTenantResolverConfig tenantConfigResolver;

    @Inject
    Config config;

    public static class ConfigProducer {

        @Inject
        Config config;

        @Produces
        @ApplicationScoped
        @Mock
        ContextTenantResolverConfig config() {
            return config.unwrap(SmallRyeConfig.class).getConfigMapping(ContextTenantResolverConfig.class);
        }
    }

    void mockConfig(boolean enableRoot) {
        var tmp = config.unwrap(SmallRyeConfig.class).getConfigMapping(ContextTenantResolverConfig.class);

        Mockito.when(tenantConfigResolver.defaultTenantValue()).thenReturn("tenant-100");
        Mockito.when(tenantConfigResolver.root()).thenReturn(new ContextTenantResolverConfig.RootConfig() {

            @Override
            public boolean enabled() {
                return enableRoot;
            }

            @Override
            public String value() {
                return tmp.root().value();
            }
        });
    }

    @Test
    @Order(1)
    void maintenanceHistoryWithoutRootTenantDataTest() {
        mockConfig(false);
        service.maintenanceHistoryData();
        List<History> result = dao.findAllAsList();
        Assertions.assertNotNull(result);
        Assertions.assertEquals(2, result.size());

        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        var pageResultDTO = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .body(new HistoryCriteriaDTO())
                .contentType(APPLICATION_JSON)
                .post("/histories")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract().body().as(HistoryPageResultDTO.class);

        Assertions.assertEquals(2, pageResultDTO.getStream().size());

        clearExpectation(mockServerClient);

        apm = createToken("org2");

        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-500")))));

        pageResultDTO = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .body(new HistoryCriteriaDTO())
                .contentType(APPLICATION_JSON)
                .post("/histories")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract().body().as(HistoryPageResultDTO.class);

        Assertions.assertEquals(1, pageResultDTO.getStream().size());

        clearExpectation(mockServerClient);

    }

    @Test
    @Order(2)

    void maintenanceHistoryWithRootTenantDataTest() {
        mockConfig(true);
        service.maintenanceHistoryData();
        List<History> result = dao.findAllAsList();
        Assertions.assertNotNull(result);
        Assertions.assertEquals(2, result.size());

        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        var pageResultDTO = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .body(new HistoryCriteriaDTO())
                .contentType(APPLICATION_JSON)
                .post("/histories")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract().body().as(HistoryPageResultDTO.class);

        Assertions.assertEquals(2, pageResultDTO.getStream().size());

        clearExpectation(mockServerClient);

        apm = createToken("org2");

        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-500")))));

        pageResultDTO = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .body(new HistoryCriteriaDTO())
                .contentType(APPLICATION_JSON)
                .post("/histories")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract().body().as(HistoryPageResultDTO.class);

        Assertions.assertEquals(0, pageResultDTO.getStream().size());

        clearExpectation(mockServerClient);

    }

    @Test
    @Order(3)
    void maintenanceHistoryNoDataTest() {
        mockConfig(false);
        var result = dao.findAllAsList();
        Assertions.assertNotNull(result);
        Assertions.assertEquals(10, result.size());

        jobDAO.deleteQueryById(MaintenanceHistoryService.JOB_ID);
        service.maintenanceHistoryData();

        result = dao.findAllAsList();
        Assertions.assertNotNull(result);
        Assertions.assertEquals(10, result.size());
    }

}


```

## Folder: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/bff/v1 (2 files)

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/bff/v1/ParameterRestControllerBffV1IT.java

```java

package org.tkit.onecx.parameters.rs.bff.v1;

import io.quarkus.test.junit.QuarkusIntegrationTest;

@QuarkusIntegrationTest
public class ParameterRestControllerBffV1IT extends ParameterRestControllerBffV1Test {
}


```

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/bff/v1/ParameterRestControllerBffV1Test.java

```java

package org.tkit.onecx.parameters.rs.bff.v1;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.mockserver.model.HttpRequest.request;
import static org.mockserver.model.HttpResponse.response;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import jakarta.ws.rs.HttpMethod;
import jakarta.ws.rs.core.Response;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockserver.client.MockServerClient;
import org.mockserver.model.JsonBody;
import org.mockserver.model.MediaType;
import org.tkit.onecx.parameters.rs.bff.v1.controllers.ParameterRestControllerBffV1;
import org.tkit.onecx.parameters.test.AbstractTest;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;
import org.tkit.quarkus.test.WithDBData;

import gen.org.tkit.onecx.parameters.rs.v1.bff.model.ParametersBulkRequestBffDTOV1;
import gen.org.tkit.onecx.parameters.rs.v1.bff.model.ParametersBulkResponseBffDTOV1;
import gen.org.tkit.onecx.tenant.client.model.TenantId;
import io.quarkiverse.mockserver.test.InjectMockServerClient;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@TestHTTPEndpoint(ParameterRestControllerBffV1.class)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-pa-ext:read" })
@WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
class ParameterRestControllerBffV1Test extends AbstractTest {

    @InjectMockServerClient
    MockServerClient mockServerClient;

    @BeforeEach
    void resetExpectation() {
        clearExpectation(mockServerClient);
    }

    @Test
    void shouldGetParamatersByProductNamesAndAppIds() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        ParametersBulkRequestBffDTOV1 request = new ParametersBulkRequestBffDTOV1();

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .contentType(APPLICATION_JSON)
                .post()
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode());

        var data = new HashMap<>(Map.of("p1", Set.of("app1")));
        data.put("access-mgmt-product", Set.of("access-mgmt"));
        request.setProducts(data);

        var res = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .body(request)
                .contentType(APPLICATION_JSON)
                .post()
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .extract().body().as(ParametersBulkResponseBffDTOV1.class);

        Assertions.assertEquals(2, res.getProducts().size());
        Assertions.assertEquals(1, res.getProducts().get("p1").size());
        Assertions.assertEquals(5, res.getProducts().get("p1").get("app1").size());
        Assertions.assertEquals(1, res.getProducts().get("access-mgmt-product").size());
        Assertions.assertEquals(2, res.getProducts().get("access-mgmt-product").get("access-mgmt").size());
    }

    @Test
    void shouldGetBadRequestIfProductsMissing() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        ParametersBulkRequestBffDTOV1 request = new ParametersBulkRequestBffDTOV1();

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .contentType(APPLICATION_JSON)
                .post()
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode());
        request.setProducts(null);

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .body(request)
                .contentType(APPLICATION_JSON)
                .post()
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode());
    }

    @Test
    void shouldGetParamatersByProductNamesAndAppIds_empty_products() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        ParametersBulkRequestBffDTOV1 request = new ParametersBulkRequestBffDTOV1();

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .contentType(APPLICATION_JSON)
                .post()
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode());
        var data = new HashMap<>(Map.of("p1", Set.of("app1")));
        data.put("access-mgmt-product", Set.of("access-mgmt"));
        data.clear();
        request.setProducts(data);

        var res = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .body(request)
                .contentType(APPLICATION_JSON)
                .post()
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .extract().body().as(ParametersBulkResponseBffDTOV1.class);

        Assertions.assertEquals(4, res.getProducts().size());

    }
}


```

## Folder: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/exim (2 files)

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/exim/ExportImportParameterRestControllerIT.java

```java

package org.tkit.onecx.parameters.rs.exim;

import io.quarkus.test.junit.QuarkusIntegrationTest;

@QuarkusIntegrationTest
public class ExportImportParameterRestControllerIT extends ExportImportParameterRestControllerTest {
}


```

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/exim/ExportImportParameterRestControllerTest.java

```java

package org.tkit.onecx.parameters.rs.exim;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static jakarta.ws.rs.core.Response.Status.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.from;
import static org.mockserver.model.HttpRequest.request;
import static org.mockserver.model.HttpResponse.response;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.ws.rs.HttpMethod;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockserver.client.MockServerClient;
import org.mockserver.model.JsonBody;
import org.mockserver.model.MediaType;
import org.tkit.onecx.parameters.rs.internal.controllers.ParameterRestController;
import org.tkit.onecx.parameters.test.AbstractTest;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;
import org.tkit.quarkus.test.WithDBData;

import gen.org.tkit.onecx.parameters.rs.internal.model.*;
import gen.org.tkit.onecx.tenant.client.model.TenantId;
import io.quarkiverse.mockserver.test.InjectMockServerClient;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@TestHTTPEndpoint(ParameterRestController.class)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-pa:read", "ocx-pa:write", "ocx-pa:all" })
class ExportImportParameterRestControllerTest extends AbstractTest {
    @InjectMockServerClient
    MockServerClient mockServerClient;

    @BeforeEach
    void resetExpectation() {
        clearExpectation(mockServerClient);
    }

    @Test
    @WithDBData(value = { "data/parameters-eximdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void exportParametersTest() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));
        var request = new ExportParameterRequestDTO();

        var dto = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .contentType(APPLICATION_JSON)
                .body(request)
                .post("/export")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ParameterSnapshotDTO.class);

        assertThat(dto).isNotNull();
        assertThat(dto.getProducts()).hasSize(2);

        dto = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .contentType(APPLICATION_JSON)
                .body(new ExportParameterRequestDTO().productNames(null))
                .post("/export")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ParameterSnapshotDTO.class);
        assertThat(dto).isNotNull();
        assertThat(dto.getProducts()).hasSize(2);

        request.setProductNames(new HashSet<>());
        dto = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .contentType(APPLICATION_JSON)
                .body(request)
                .post("/export")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ParameterSnapshotDTO.class);
        assertThat(dto).isNotNull();
        assertThat(dto.getProducts()).hasSize(2);

        request.setProductNames(Set.of("import-product"));
        dto = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .contentType(APPLICATION_JSON)
                .body(request)
                .post("/export")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ParameterSnapshotDTO.class);
        assertThat(dto).isNotNull();
        assertThat(dto.getProducts()).hasSize(1);
    }

    @Test
    @WithDBData(value = { "data/parameters-eximdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void exportThemesWrongNamesTest() {

        var request = new ExportParameterRequestDTO();
        request.setProductNames(Set.of("does-not-exists"));
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));
        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .contentType(APPLICATION_JSON)
                .body(request)
                .post("/export")
                .then()
                .statusCode(NOT_FOUND.getStatusCode());
    }

    @Test
    @WithDBData(value = { "data/parameters-eximdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void exportThemesEmptyBodyTest() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));
        var exception = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .contentType(APPLICATION_JSON)
                .post("/export")
                .then()
                .statusCode(BAD_REQUEST.getStatusCode())
                .extract().as(ProblemDetailResponseDTO.class);

        assertThat(exception.getErrorCode()).isEqualTo("CONSTRAINT_VIOLATIONS");
        assertThat(exception.getDetail()).isEqualTo("exportParameters.exportParameterRequestDTO: must not be null");
    }

    @Test
    @WithDBData(value = { "data/parameters-eximdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void importParametersTest() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));
        var request = new ParameterSnapshotDTO();

        var data = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .contentType(APPLICATION_JSON)
                .body(request)
                .post("/export")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ParameterSnapshotDTO.class);
        assertThat(data).isNotNull();
        assertThat(data.getProducts()).hasSize(2);

        var importParameter = new EximParameterDTO();
        importParameter.setDescription("new theme description");
        importParameter.setName("test1");
        importParameter.setApplicationId("test1");
        importParameter.setProductName("test-product");
        data.getProducts().put("test-product", List.of(importParameter));
        // add new displayName to existing parameter
        data.getProducts().get("import-product2").get(0).setDisplayName("updatedDisplayName");

        var dto = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .contentType(APPLICATION_JSON)
                .body(data)
                .post("/import")
                .then()
                .statusCode(OK.getStatusCode())
                .extract().as(ImportParameterResponseDTO.class);

        assertThat(dto.getParameters()).isNotNull().hasSize(4);
        assertThat(dto.getParameters().get("importParam2")).returns(ImportParameterResponseStatusDTO.UPDATE.toString(),
                from(ImportParameterResponseStatusDTO::toString));
        assertThat(dto.getParameters().get("test1")).returns(ImportParameterResponseStatusDTO.CREATED.toString(),
                from(ImportParameterResponseStatusDTO::toString));
    }
}


```

## Folder: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/external/v1 (2 files)

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/external/v1/ParameterRestControllerV1Test.java

```java

package org.tkit.onecx.parameters.rs.external.v1;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.mockserver.model.HttpRequest.request;
import static org.mockserver.model.HttpResponse.response;

import java.util.Map;

import jakarta.ws.rs.HttpMethod;
import jakarta.ws.rs.core.Response;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockserver.client.MockServerClient;
import org.mockserver.model.JsonBody;
import org.mockserver.model.MediaType;
import org.tkit.onecx.parameters.rs.external.v1.controllers.ParameterRestControllerV1;
import org.tkit.onecx.parameters.test.AbstractTest;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;
import org.tkit.quarkus.test.WithDBData;

import gen.org.tkit.onecx.parameters.rs.v1.model.ParameterInfoDTOV1;
import gen.org.tkit.onecx.parameters.rs.v1.model.ParametersBucketDTOV1;
import gen.org.tkit.onecx.tenant.client.model.TenantId;
import io.quarkiverse.mockserver.test.InjectMockServerClient;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.path.json.JsonPath;

@QuarkusTest
@TestHTTPEndpoint(ParameterRestControllerV1.class)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-pa-ap:read", "ocx-pa-me:write" })
class ParameterRestControllerV1Test extends AbstractTest {

    @InjectMockServerClient
    MockServerClient mockServerClient;

    @BeforeEach
    void resetExpectation() {
        clearExpectation(mockServerClient);
    }

    @Test
    void shouldNotFindParametersWithGivenApplicationId() {

        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .pathParam("productName", "not-exist")
                .pathParam("appId", "not-exist")
                .get("parameters")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode());
    }

    @Test
    @WithDBData(value = { "data/parameters-importdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void shouldReturnImportValueParameter() {

        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        Map<String, Object> applicationParameters = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .contentType(APPLICATION_JSON)
                .pathParam("productName", "import-product")
                .pathParam("appId", "import-app")
                .get("parameters")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().jsonPath().getMap(".");
        Assertions.assertEquals(2, applicationParameters.size());
        Assertions.assertEquals("import-value", applicationParameters.get("importParam"));
    }

    @Test
    @WithDBData(value = { "data/parameters-importdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void shouldReturnImportValueParameterOrg2() {

        var apm = createToken("org2");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-200")))));

        Map<String, Object> applicationParameters = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .when()
                .header("apm-principal-token", apm)
                .contentType(APPLICATION_JSON)
                .pathParam("productName", "import-product")
                .pathParam("appId", "import-app")
                .get("parameters")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().jsonPath().getMap(".");
        Assertions.assertEquals(1, applicationParameters.size());
        Assertions.assertEquals("import-value-200", applicationParameters.get("importParam"));
    }

    @Test
    @WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void shouldReturnParameter() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        Map<String, Object> applicationParameters = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .pathParam("productName", "access-mgmt-product")
                .pathParam("appId", "access-mgmt")
                .get("parameters")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().jsonPath().getMap(".");
        Assertions.assertEquals(1, applicationParameters.size());
        Assertions.assertEquals("KOGITO", applicationParameters.get("ENGINE"));
    }

    @Test
    @WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void shouldNotReturnParameterWithNullSetValue() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        JsonPath applicationParameters = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .pathParam("productName", "access-mgmt-product")
                .pathParam("appId", "access-mgmt")
                .get("parameters")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body()
                .jsonPath();
        Assertions.assertNull(applicationParameters.get("COUNTER"));
    }

    @Test
    @WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void shouldCreateNewParameter() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        ParametersBucketDTOV1 parametersBucketDTO = new ParametersBucketDTOV1();
        ParameterInfoDTOV1 parameterInfoDTO1 = new ParameterInfoDTOV1();
        parameterInfoDTO1.setCount(1L);
        parameterInfoDTO1.setCurrentValue("DefaultValue");
        parameterInfoDTO1.setDefaultValue("DefaultValue");
        parametersBucketDTO.getParameters().put("testKey", parameterInfoDTO1);
        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .contentType(APPLICATION_JSON)
                .body(parametersBucketDTO)
                .pathParam("productName", "new-product")
                .pathParam("appId", "new-application")
                .post("history")
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());
        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .pathParam("productName", "new-product")
                .pathParam("appId", "new-application")
                .get("parameters")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode());
    }

    @Test
    @WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void shouldUpdateParameters() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        ParametersBucketDTOV1 parametersBucketDTO = new ParametersBucketDTOV1();
        ParameterInfoDTOV1 parameterInfoDTO1 = new ParameterInfoDTOV1();
        parameterInfoDTO1.setCount(2L);
        parameterInfoDTO1.setCurrentValue("10");
        parameterInfoDTO1.setDefaultValue("10");
        parametersBucketDTO.getParameters().put("COUNTER", parameterInfoDTO1);
        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .contentType(APPLICATION_JSON)
                .body(parametersBucketDTO)
                .pathParam("productName", "access-mgmt-product")
                .pathParam("appId", "access-mgmt")
                .post("history")
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());
    }

    @Test
    void bucketRequestEmptyDTO() {

        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .contentType(APPLICATION_JSON)
                .pathParam("productName", "test")
                .pathParam("appId", "test")
                .post("history")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode());
    }

    @Test
    void bucketRequestNoParametersDTO() {

        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        ParametersBucketDTOV1 parametersBucketDTO = new ParametersBucketDTOV1();
        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .contentType(APPLICATION_JSON)
                .body(parametersBucketDTO)
                .pathParam("productName", "test")
                .pathParam("appId", "test")
                .post("history")
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());
    }

    @Test
    void bucketRequestNullParametersDTO() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        ParametersBucketDTOV1 parametersBucketDTO = new ParametersBucketDTOV1();
        parametersBucketDTO.setParameters(null);
        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .contentType(APPLICATION_JSON)
                .body(parametersBucketDTO)
                .pathParam("productName", "test")
                .pathParam("appId", "test")
                .post("history")
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());
    }

}


```

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/external/v1/ParameterRestControllerV1TestIT.java

```java

package org.tkit.onecx.parameters.rs.external.v1;

import io.quarkus.test.junit.QuarkusIntegrationTest;

@QuarkusIntegrationTest
public class ParameterRestControllerV1TestIT extends ParameterRestControllerV1Test {
}


```

## Folder: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/external/v2 (2 files)

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/external/v2/ParameterRestControllerV2Test.java

```java

package org.tkit.onecx.parameters.rs.external.v2;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.mockserver.model.HttpRequest.request;
import static org.mockserver.model.HttpResponse.response;

import java.util.Map;

import jakarta.ws.rs.HttpMethod;
import jakarta.ws.rs.core.Response;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockserver.client.MockServerClient;
import org.mockserver.model.JsonBody;
import org.mockserver.model.MediaType;
import org.tkit.onecx.parameters.rs.external.v2.controllers.ParameterRestControllerV2;
import org.tkit.onecx.parameters.test.AbstractTest;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;
import org.tkit.quarkus.test.WithDBData;

import gen.org.tkit.onecx.parameters.rs.v2.model.ParameterInfoDTOV2;
import gen.org.tkit.onecx.parameters.rs.v2.model.ParametersBucketDTOV2;
import gen.org.tkit.onecx.tenant.client.model.TenantId;
import io.quarkiverse.mockserver.test.InjectMockServerClient;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.path.json.JsonPath;

@QuarkusTest
@TestHTTPEndpoint(ParameterRestControllerV2.class)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-pa-ap:read", "ocx-pa-me:write" })
class ParameterRestControllerV2Test extends AbstractTest {

    @InjectMockServerClient
    MockServerClient mockServerClient;

    @BeforeEach
    void resetExpectation() {
        clearExpectation(mockServerClient);
    }

    @Test
    void shouldNotFindParametersWithGivenApplicationId() {

        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .pathParam("productName", "not-exist")
                .pathParam("appId", "not-exist")
                .get()
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode());
    }

    @Test
    @WithDBData(value = { "data/parameters-importdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void shouldReturnImportValueParameter() {

        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        Map<String, Object> applicationParameters = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .contentType(APPLICATION_JSON)
                .pathParam("productName", "import-product")
                .pathParam("appId", "import-app")
                .get()
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().jsonPath().getMap(".");
        Assertions.assertEquals(2, applicationParameters.size());
        Assertions.assertEquals("import-value", applicationParameters.get("importParam"));
    }

    @Test
    @WithDBData(value = { "data/parameters-importdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void shouldReturnImportValueParameterOrg2() {

        var apm = createToken("org2");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-200")))));

        Map<String, Object> applicationParameters = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .when()
                .header("apm-principal-token", apm)
                .contentType(APPLICATION_JSON)
                .pathParam("productName", "import-product")
                .pathParam("appId", "import-app")
                .get()
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().jsonPath().getMap(".");
        Assertions.assertEquals(1, applicationParameters.size());
        Assertions.assertEquals("import-value-200", applicationParameters.get("importParam"));
    }

    @Test
    @WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void shouldReturnParameter() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        Map<String, Object> applicationParameters = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .pathParam("productName", "access-mgmt-product")
                .pathParam("appId", "access-mgmt")
                .get()
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().jsonPath().getMap(".");
        Assertions.assertEquals(1, applicationParameters.size());
        Assertions.assertEquals("KOGITO", applicationParameters.get("ENGINE"));
    }

    @Test
    @WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void shouldNotReturnParameterWithNullSetValue() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        JsonPath applicationParameters = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .pathParam("productName", "access-mgmt-product")
                .pathParam("appId", "access-mgmt")
                .get()
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body()
                .jsonPath();
        Assertions.assertNull(applicationParameters.get("COUNTER"));
    }

    @Test
    @WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void shouldCreateNewParameter() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        ParametersBucketDTOV2 parametersBucketDTO = new ParametersBucketDTOV2();
        ParameterInfoDTOV2 parameterInfoDTO1 = new ParameterInfoDTOV2();
        parameterInfoDTO1.setCount(1L);
        parameterInfoDTO1.setCurrentValue("DefaultValue");
        parameterInfoDTO1.setDefaultValue("DefaultValue");
        parametersBucketDTO.getParameters().put("testKey", parameterInfoDTO1);
        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .contentType(APPLICATION_JSON)
                .body(parametersBucketDTO)
                .pathParam("productName", "new-product")
                .pathParam("appId", "new-application")
                .post()
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());
        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .pathParam("productName", "new-product")
                .pathParam("appId", "new-application")
                .get()
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode());
    }

    @Test
    @WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void shouldUpdateParameters() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        ParametersBucketDTOV2 parametersBucketDTO = new ParametersBucketDTOV2();
        ParameterInfoDTOV2 parameterInfoDTO1 = new ParameterInfoDTOV2();
        parameterInfoDTO1.setCount(2L);
        parameterInfoDTO1.setCurrentValue("10");
        parameterInfoDTO1.setDefaultValue("10");
        parametersBucketDTO.getParameters().put("COUNTER", parameterInfoDTO1);
        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .contentType(APPLICATION_JSON)
                .body(parametersBucketDTO)
                .pathParam("productName", "access-mgmt-product")
                .pathParam("appId", "access-mgmt")
                .post()
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());
    }

    @Test
    void bucketRequestEmptyDTO() {

        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .contentType(APPLICATION_JSON)
                .pathParam("productName", "test")
                .pathParam("appId", "test")
                .post()
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode());
    }

    @Test
    void bucketRequestNoParametersDTO() {

        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        ParametersBucketDTOV2 parametersBucketDTO = new ParametersBucketDTOV2();
        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .contentType(APPLICATION_JSON)
                .body(parametersBucketDTO)
                .pathParam("productName", "test")
                .pathParam("appId", "test")
                .post()
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());
    }

    @Test
    void bucketRequestNullParametersDTO() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        ParametersBucketDTOV2 parametersBucketDTO = new ParametersBucketDTOV2();
        parametersBucketDTO.setParameters(null);
        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .contentType(APPLICATION_JSON)
                .body(parametersBucketDTO)
                .pathParam("productName", "test")
                .pathParam("appId", "test")
                .post()
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());
    }

}


```

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/external/v2/ParameterRestControllerV2TestIT.java

```java

package org.tkit.onecx.parameters.rs.external.v2;

import io.quarkus.test.junit.QuarkusIntegrationTest;

@QuarkusIntegrationTest
class ParameterRestControllerV2TestIT extends ParameterRestControllerV2Test {

}


```

## Folder: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/internal (4 files)

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/internal/HistoryRestControllerIT.java

```java

package org.tkit.onecx.parameters.rs.internal;

import io.quarkus.test.junit.QuarkusIntegrationTest;

@QuarkusIntegrationTest
class HistoryRestControllerIT extends HistoryRestControllerTest {
}


```

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/internal/HistoryRestControllerTest.java

```java

package org.tkit.onecx.parameters.rs.internal;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.mockserver.model.HttpRequest.request;
import static org.mockserver.model.HttpResponse.response;

import java.util.stream.Stream;

import jakarta.ws.rs.HttpMethod;
import jakarta.ws.rs.core.Response;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockserver.client.MockServerClient;
import org.mockserver.model.JsonBody;
import org.mockserver.model.MediaType;
import org.tkit.onecx.parameters.rs.internal.controllers.HistoryRestController;
import org.tkit.onecx.parameters.test.AbstractTest;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;
import org.tkit.quarkus.test.WithDBData;

import gen.org.tkit.onecx.parameters.rs.internal.model.*;
import gen.org.tkit.onecx.tenant.client.model.TenantId;
import io.quarkiverse.mockserver.test.InjectMockServerClient;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@TestHTTPEndpoint(HistoryRestController.class)
@WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-pa:read", "ocx-pa:write", "ocx-pa:delete", "ocx-pa:all" })
class HistoryRestControllerTest extends AbstractTest {

    @InjectMockServerClient
    MockServerClient mockServerClient;

    @BeforeEach
    void resetExpectation() {
        clearExpectation(mockServerClient);
    }

    @Test
    void shouldFindAllParametersHistoryWithoutCriteria() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        var pageResultDTO = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .body(new HistoryCriteriaDTO())
                .contentType(APPLICATION_JSON)
                .post()
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract().body().as(HistoryPageResultDTO.class);

        Assertions.assertEquals(6, pageResultDTO.getStream().size());
        Assertions.assertEquals(Long.valueOf(6), pageResultDTO.getTotalElements());

    }

    static Stream<Arguments> findByCriteriaTestData() {
        return Stream.of(
                Arguments.of(new HistoryCriteriaDTO(), 6),
                Arguments.of(new HistoryCriteriaDTO().applicationId("abc").productName("").name(""), 0),
                Arguments.of(new HistoryCriteriaDTO().applicationId("app0").productName("p0").name("key0"), 0),
                Arguments.of(new HistoryCriteriaDTO().applicationId("access-mgmt")
                        .productName("access-mgmt-product"), 2),
                Arguments.of(new HistoryCriteriaDTO().applicationId("app0").productName("p0"), 0),
                Arguments.of(new HistoryCriteriaDTO().applicationId("app1").productName("p1"), 1),
                Arguments.of(new HistoryCriteriaDTO().applicationId("app2").productName("p2"), 3));
    }

    @ParameterizedTest
    @MethodSource("findByCriteriaTestData")
    void shouldFindParametersHistoryByCriteria(HistoryCriteriaDTO criteriaDTO, Integer expectedArraySize) {

        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        var pageResultDTO = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .body(criteriaDTO)
                .contentType(APPLICATION_JSON)
                .post()
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(HistoryPageResultDTO.class);
        Assertions.assertEquals(expectedArraySize, pageResultDTO.getStream().size());
    }

    static Stream<Arguments> findByCriteriaTestDataQueryLatest() {
        return Stream.of(
                Arguments.of(new HistoryCriteriaDTO(), 6),
                Arguments.of(new HistoryCriteriaDTO().applicationId("access-mgmt")
                        .productName("access-mgmt-product"), 2),
                Arguments.of(new HistoryCriteriaDTO().applicationId("").productName("").name(""), 6),
                Arguments.of(new HistoryCriteriaDTO().applicationId("").productName("").name("key1"), 1),
                Arguments.of(new HistoryCriteriaDTO().applicationId("").productName(""), 6),
                Arguments.of(new HistoryCriteriaDTO().applicationId("app0").productName("p0"), 0),
                Arguments.of(new HistoryCriteriaDTO().applicationId("app1").productName("p1"), 1),
                Arguments.of(new HistoryCriteriaDTO().applicationId("app2").productName("p2"), 3));
    }

    @ParameterizedTest
    @MethodSource("findByCriteriaTestDataQueryLatest")
    void shouldFindParametersHistoryByCriteriaQueryLatest(HistoryCriteriaDTO criteriaDTO,
            Integer expectedArraySize) {

        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        var pageResultDTO = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .body(criteriaDTO)
                .contentType(APPLICATION_JSON)
                .post("latest")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(HistoryPageResultDTO.class);
        Assertions.assertEquals(expectedArraySize, pageResultDTO.getStream().size());
    }

    @Test
    void getParametersHistoryByIdNoFoundTest() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .pathParam("id", "not-id")
                .get("{id}")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode());
    }

    static Stream<Arguments> getParametersHistoryByIds() {
        return Stream.of(
                Arguments.of("1", "access-mgmt", "access-mgmt-product"),
                Arguments.of("2", "access-mgmt", "access-mgmt-product"),
                Arguments.of("h1", "app1", "p1"),
                Arguments.of("h2", "app2", "p2"));
    }

    @ParameterizedTest
    @MethodSource("getParametersHistoryByIds")
    void getParametersHistoryById(String id, String applicationId, String productName) {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        var result = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .pathParam("id", id)
                .get("{id}")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(HistoryDTO.class);
        Assertions.assertNotNull(result);
        Assertions.assertEquals(id, result.getId());
        Assertions.assertEquals(applicationId, result.getApplicationId());
        Assertions.assertEquals(productName, result.getProductName());

    }

    static Stream<Arguments> findCountByCriteriaTestData() {
        return Stream.of(
                Arguments.of(new HistoryCountCriteriaDTO(), 6),
                Arguments.of(new HistoryCountCriteriaDTO().applicationId("").productName("").name(""), 6),
                Arguments.of(new HistoryCountCriteriaDTO().applicationId("").productName("").name("key1"), 1),
                Arguments.of(
                        new HistoryCountCriteriaDTO().applicationId("access-mgmt").productName("access-mgmt-product"),
                        2),
                Arguments.of(new HistoryCountCriteriaDTO().applicationId("app0").productName("p0"), 0),
                Arguments.of(new HistoryCountCriteriaDTO().applicationId("app1").productName("p1"), 1),
                Arguments.of(new HistoryCountCriteriaDTO().applicationId("app2").productName("p2"), 3));
    }

    @ParameterizedTest
    @MethodSource("findCountByCriteriaTestData")
    void getCountsByCriteriaTest(HistoryCountCriteriaDTO criteria, Integer expectedArraySize) {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        var tmp = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .body(criteria)
                .contentType(APPLICATION_JSON)
                .post("counts")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .extract().jsonPath();

        Assertions.assertEquals(expectedArraySize, tmp.getList(".").size());
    }

    @Test
    void searchAllApplicationsTest() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        var output = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .get("products")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(ProductDTO[].class);
        Assertions.assertEquals(3, output.length);
    }
}


```

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/internal/ParameterRestControllerIT.java

```java

package org.tkit.onecx.parameters.rs.internal;

import io.quarkus.test.junit.QuarkusIntegrationTest;

@QuarkusIntegrationTest
public class ParameterRestControllerIT extends ParameterRestControllerTest {
}


```

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/internal/ParameterRestControllerTest.java

```java

package org.tkit.onecx.parameters.rs.internal;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.mockserver.model.HttpRequest.request;
import static org.mockserver.model.HttpResponse.response;

import java.util.stream.Stream;

import jakarta.ws.rs.HttpMethod;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockserver.client.MockServerClient;
import org.mockserver.model.JsonBody;
import org.mockserver.model.MediaType;
import org.tkit.onecx.parameters.rs.internal.controllers.ParameterRestController;
import org.tkit.onecx.parameters.test.AbstractTest;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;
import org.tkit.quarkus.test.WithDBData;

import gen.org.tkit.onecx.parameters.rs.internal.model.*;
import gen.org.tkit.onecx.tenant.client.model.TenantId;
import io.quarkiverse.mockserver.test.InjectMockServerClient;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@TestHTTPEndpoint(ParameterRestController.class)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-pa:read", "ocx-pa:write", "ocx-pa:delete", "ocx-pa:all" })
class ParameterRestControllerTest extends AbstractTest {

    static final String PATH_PARAM_ID = "id";
    static final String PATH_PARAM_ID_PATH = "{" + PATH_PARAM_ID + "}";

    @InjectMockServerClient
    MockServerClient mockServerClient;

    @BeforeEach
    void resetExpectation() {
        clearExpectation(mockServerClient);
    }

    @Test
    @WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void shouldFindAllParametersWithoutCriteria() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        ParameterPageResultDTO pageResultDTO = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .body(new ParameterSearchCriteriaDTO())
                .contentType(APPLICATION_JSON)
                .post("/search")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .extract().body().as(ParameterPageResultDTO.class);

        Assertions.assertEquals(9, pageResultDTO.getStream().size());
        Assertions.assertEquals(Long.valueOf(9), pageResultDTO.getTotalElements());

    }

    @Test
    @WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void searchAllApplicationsTest() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        var output = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .get("products")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(ProductDTO[].class);
        Assertions.assertEquals(4, output.length);
    }

    static Stream<Arguments> findAllNames() {
        return Stream.of(
                Arguments.of("p1", "", 5),
                Arguments.of("p1", "app1", 5));
    }

    @ParameterizedTest
    @MethodSource("findAllNames")
    @WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void searchAllNamesTest(String productName, String applicationId, int expectedArraySize) {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        var pageResultDTO = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .queryParam("applicationId", applicationId)
                .get("/names/" + productName)
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(NamesPageResultDTO.class);
        Assertions.assertEquals(expectedArraySize, pageResultDTO.getStream().size());
    }

    @Test
    @WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void searchAllNamesNoAppTest() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        var pageResultDTO = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .get("/names/p1")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(NamesPageResultDTO.class);
        Assertions.assertEquals(5, pageResultDTO.getStream().size());
    }

    static Stream<Arguments> findByCriteriaTestData() {
        return Stream.of(
                Arguments.of(new ParameterSearchCriteriaDTO().applicationId("").productName(""), 9),
                Arguments.of(new ParameterSearchCriteriaDTO().applicationId("access-mgmt").productName("access-mgmt-product"),
                        2),
                Arguments.of(new ParameterSearchCriteriaDTO().applicationId("incorrect_app").productName("incorrect-product"),
                        0),
                Arguments.of(new ParameterSearchCriteriaDTO().applicationId("incorrect_app").productName("incorrect-product")
                        .name(""), 0),
                Arguments.of(new ParameterSearchCriteriaDTO().name("custom"), 0),
                Arguments.of(new ParameterSearchCriteriaDTO().name("ENGINE"), 1),
                Arguments.of(new ParameterSearchCriteriaDTO().name("incorrect_key"), 0));
    }

    @ParameterizedTest
    @MethodSource("findByCriteriaTestData")
    @WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void shouldFindParametersByCriteria(ParameterSearchCriteriaDTO criteriaDTO, Integer expectedArraySize) {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        ParameterPageResultDTO pageResultDTO = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .body(criteriaDTO)
                .contentType(APPLICATION_JSON)
                .post("/search")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(ParameterPageResultDTO.class);
        Assertions.assertEquals(expectedArraySize, pageResultDTO.getStream().size());
    }

    @Test
    @WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void shouldFindParameterById() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        ParameterDTO applicationParameterDTO = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .pathParam(PATH_PARAM_ID, "111")
                .get(PATH_PARAM_ID_PATH)
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .contentType(APPLICATION_JSON)
                .extract()
                .body().as(ParameterDTO.class);
        Assertions.assertNotNull(applicationParameterDTO);
        Assertions.assertEquals("access-mgmt", applicationParameterDTO.getApplicationId());
        Assertions.assertEquals("access-mgmt-product", applicationParameterDTO.getProductName());
        Assertions.assertEquals("ENGINE", applicationParameterDTO.getName());
        Assertions.assertEquals("KOGITO", applicationParameterDTO.getValue());
        Assertions.assertEquals("Engine", applicationParameterDTO.getDisplayName());
        Assertions.assertNull(applicationParameterDTO.getDescription());
    }

    @Test
    void shouldNotFindParameterById() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .pathParam(PATH_PARAM_ID, "150")
                .get(PATH_PARAM_ID_PATH)
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode());
    }

    @Test
    void shouldNotFindUpdateParameterById() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        ParameterUpdateDTO applicationParameterUpdateDTO = new ParameterUpdateDTO();
        applicationParameterUpdateDTO.setValue("JBPM");
        applicationParameterUpdateDTO.setDescription("Test description");
        applicationParameterUpdateDTO.setModificationCount(1);

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .contentType(APPLICATION_JSON)
                .body(applicationParameterUpdateDTO)
                .pathParam(PATH_PARAM_ID, "150")
                .put(PATH_PARAM_ID_PATH)
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode());
    }

    static Stream<Arguments> updateParameterTestInput() {
        return Stream.of(
                Arguments.of("access-mgmt", "Test description", "111", "JBPM", null, null, null, null, 1),
                Arguments.of("access-mgmt", "Test description", "111", "JBPM", "", null, null, null, 1),
                Arguments.of("access-mgmt", "Test description", "111", "JBPM", " ", null, null, null, 1));
    }

    @ParameterizedTest
    @MethodSource("updateParameterTestInput")
    @WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void shouldUpdateParameterTest(String appId, String desc, String id, String value, String unit, Integer from, Integer to,
            String checkUnit, Integer modificationCount) {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        var request = new ParameterUpdateDTO();
        request.setValue(value);
        request.setDescription(desc);
        request.setModificationCount(modificationCount);

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .body(request)
                .contentType(APPLICATION_JSON)
                .when()
                .pathParam(PATH_PARAM_ID, id)
                .put(PATH_PARAM_ID_PATH)
                .then()
                .statusCode(Response.Status.OK.getStatusCode());

        var dto = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .pathParam(PATH_PARAM_ID, id)
                .get(PATH_PARAM_ID_PATH)
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .extract()
                .body().as(ParameterDTO.class);
        Assertions.assertNotNull(dto);
        Assertions.assertEquals(appId, dto.getApplicationId());
        Assertions.assertEquals(value, dto.getValue());
        Assertions.assertEquals(desc, dto.getDescription());
    }

    @WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    @Test
    void update_optLockExceptionTest() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        var request = new ParameterUpdateDTO();
        request.setValue("123");
        request.setDescription("desc");
        request.setModificationCount(1);

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .body(request)
                .contentType(APPLICATION_JSON)
                .when()
                .pathParam(PATH_PARAM_ID, 111)
                .put(PATH_PARAM_ID_PATH)
                .then()
                .statusCode(Response.Status.OK.getStatusCode());

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .body(request)
                .contentType(APPLICATION_JSON)
                .when()
                .pathParam(PATH_PARAM_ID, 111)
                .put(PATH_PARAM_ID_PATH)
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode());

        request.setModificationCount(2);

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .body(request)
                .contentType(APPLICATION_JSON)
                .when()
                .pathParam(PATH_PARAM_ID, 111)
                .put(PATH_PARAM_ID_PATH)
                .then()
                .statusCode(Response.Status.OK.getStatusCode());

    }

    @Test
    @WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void update_without_body_test() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .contentType(APPLICATION_JSON)
                .when()
                .pathParam(PATH_PARAM_ID, "GUID1")
                .put(PATH_PARAM_ID_PATH)
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode());
    }

    static Stream<Arguments> createParameterTestInput() {
        return Stream.of(
                Arguments.of("app_10", "p10", "description", "key_10", "value_10"),
                Arguments.of("app_10", "p10", "description", "key_11", "value_10", ""),
                Arguments.of("app_10", "p10", "description", "key_12", "value_10", " "));
    }

    @ParameterizedTest
    @MethodSource("createParameterTestInput")
    @WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void createParameterTest(String appId, String productName, String desc, String key, String value) {

        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        ParameterCreateDTO dto = new ParameterCreateDTO();
        dto.setApplicationId(appId);
        dto.setProductName(productName);
        dto.setDescription(desc);
        dto.setName(key);
        dto.setValue(value);

        String uri = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .body(dto)
                .contentType(APPLICATION_JSON)
                .post()
                .then()
                .statusCode(Response.Status.CREATED.getStatusCode())
                .extract().header(HttpHeaders.LOCATION);

        ParameterDTO dto2 = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .contentType(APPLICATION_JSON)
                .get(uri)
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .extract()
                .body().as(ParameterDTO.class);

        Assertions.assertNotNull(dto2);
        Assertions.assertEquals(dto.getApplicationId(), dto2.getApplicationId());
        Assertions.assertEquals(dto.getProductName(), dto2.getProductName());
        Assertions.assertEquals(dto.getDescription(), dto2.getDescription());
        Assertions.assertEquals(dto.getName(), dto2.getName());
        Assertions.assertEquals(dto.getValue(), dto2.getValue());

    }

    @Test
    void createTwice_Bad_Request_Test() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        ParameterCreateDTO dto = new ParameterCreateDTO();
        dto.setApplicationId("app1");
        dto.setProductName("productName1");
        dto.setName("key1");
        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .body(dto)
                .contentType(APPLICATION_JSON)
                .post()
                .then()
                .statusCode(Response.Status.CREATED.getStatusCode());
        var err = given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .body(dto)
                .contentType(APPLICATION_JSON)
                .post()
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .extract().as(ProblemDetailResponseDTO.class);
        Assertions.assertNotNull(err.getDetail());
    }

    static Stream<Arguments> deleteParameterTestInput() {
        return Stream.of(
                Arguments.of("GUID1"),
                Arguments.of("GUID2"),
                Arguments.of("GUID3"),
                Arguments.of("GUID4"),
                Arguments.of("GUID5"));
    }

    @ParameterizedTest
    @MethodSource("deleteParameterTestInput")
    @WithDBData(value = { "data/parameters-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void deleteParameterTest(String id) {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .contentType(APPLICATION_JSON)
                .pathParam(PATH_PARAM_ID, id)
                .get(PATH_PARAM_ID_PATH)
                .then()
                .statusCode(Response.Status.OK.getStatusCode());

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .contentType(APPLICATION_JSON)
                .pathParam(PATH_PARAM_ID, id)
                .delete(PATH_PARAM_ID_PATH)
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .contentType(APPLICATION_JSON)
                .pathParam(PATH_PARAM_ID, id)
                .get(PATH_PARAM_ID_PATH)
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode());

    }

    @Test
    void deleteNoneExistsParameterTest() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .contentType(APPLICATION_JSON)
                .pathParam(PATH_PARAM_ID, "NONE_EXISTS")
                .delete(PATH_PARAM_ID_PATH)
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());

    }
}


```

## Folder: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/operator/v1 (2 files)

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/operator/v1/ParameterOperatorRestControllerV1Test.java

```java

package org.tkit.onecx.parameters.rs.operator.v1;

import static io.restassured.RestAssured.given;
import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.mockserver.model.HttpRequest.request;
import static org.mockserver.model.HttpResponse.response;

import jakarta.ws.rs.HttpMethod;
import jakarta.ws.rs.core.Response;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockserver.client.MockServerClient;
import org.mockserver.model.JsonBody;
import org.mockserver.model.MediaType;
import org.tkit.onecx.parameters.rs.operator.v1.controllers.OperatorParameterRestControllerV1;
import org.tkit.onecx.parameters.test.AbstractTest;
import org.tkit.quarkus.security.test.GenerateKeycloakClient;
import org.tkit.quarkus.test.WithDBData;

import gen.org.tkit.onecx.parameters.rs.v1.operator.model.ParameterUpdateRequestOperatorDTOV1;
import gen.org.tkit.onecx.parameters.rs.v1.operator.model.ParametersUpdateRequestOperatorDTOV1;
import gen.org.tkit.onecx.tenant.client.model.TenantId;
import io.quarkiverse.mockserver.test.InjectMockServerClient;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
@TestHTTPEndpoint(OperatorParameterRestControllerV1.class)
@GenerateKeycloakClient(clientName = "testClient", scopes = { "ocx-pa-op:write" })
class ParameterOperatorRestControllerV1Test extends AbstractTest {

    @InjectMockServerClient
    MockServerClient mockServerClient;

    @BeforeEach
    void resetExpectation() {
        clearExpectation(mockServerClient);
    }

    @Test
    @WithDBData(value = { "data/operator-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void shouldUpdateParameterTest() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        var requestBody = new ParametersUpdateRequestOperatorDTOV1()
                .addParametersItem(new ParameterUpdateRequestOperatorDTOV1().name("name1").value("value1"));

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .contentType(APPLICATION_JSON)
                .pathParam("productName", "product1")
                .pathParam("applicationId", "app1")
                .body(requestBody)
                .put()
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());
    }

    @Test
    @WithDBData(value = { "data/operator-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void shouldCreateParameterTest() {
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        var requestBody = new ParametersUpdateRequestOperatorDTOV1()
                .addParametersItem(new ParameterUpdateRequestOperatorDTOV1().name("name2").value("value2"))
                .addParametersItem(new ParameterUpdateRequestOperatorDTOV1().name("name3").value("value3"));

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .contentType(APPLICATION_JSON)
                .pathParam("productName", "product2")
                .pathParam("applicationId", "app2")
                .body(requestBody)
                .put()
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());
    }

    @Test
    @WithDBData(value = { "data/operator-testdata.xml" }, deleteBeforeInsert = true, rinseAndRepeat = true)
    void constraintViolationMissingFieldsTest() {
        keycloakTestClient.getClientAccessToken("testClient");
        var apm = createToken("org1");
        addExpectation(mockServerClient
                .when(request().withPath("/v1/tenant").withMethod(HttpMethod.GET).withHeader("apm-principal-token", apm))
                .respond(httpRequest -> response().withStatusCode(Response.Status.OK.getStatusCode())
                        .withContentType(MediaType.APPLICATION_JSON)
                        .withBody(JsonBody.json(new TenantId().tenantId("tenant-100")))));

        var requestBody = new ParametersUpdateRequestOperatorDTOV1()
                .addParametersItem(new ParameterUpdateRequestOperatorDTOV1().value("value2"));

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .contentType(APPLICATION_JSON)
                .pathParam("productName", "product2")
                .pathParam("applicationId", "app2")
                .body(requestBody)
                .put()
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode());

        requestBody = new ParametersUpdateRequestOperatorDTOV1();

        given()
                .auth().oauth2(keycloakTestClient.getClientAccessToken("testClient"))
                .header(HEADER_APM_TOKEN, apm)
                .when()
                .contentType(APPLICATION_JSON)
                .pathParam("productName", "product2")
                .pathParam("applicationId", "app2")
                .body(requestBody)
                .put()
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode());
    }
}


```

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/rs/operator/v1/ParameterOperatorRestControllerV1TestIT.java

```java

package org.tkit.onecx.parameters.rs.operator.v1;

import io.quarkus.test.junit.QuarkusIntegrationTest;

@QuarkusIntegrationTest
public class ParameterOperatorRestControllerV1TestIT extends ParameterOperatorRestControllerV1Test {
}


```

## Folder: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/test (1 files)

### File: onecx-parameter-svc/src/test/java/org/tkit/onecx/parameters/test/AbstractTest.java

```java

package org.tkit.onecx.parameters.test;

import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.util.ArrayList;
import java.util.List;

import jakarta.json.Json;
import jakarta.json.JsonObjectBuilder;

import org.eclipse.microprofile.jwt.Claims;
import org.mockserver.client.MockServerClient;
import org.mockserver.mock.Expectation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import io.quarkiverse.mockserver.test.MockServerTestResource;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.keycloak.client.KeycloakTestClient;
import io.restassured.RestAssured;
import io.restassured.config.ObjectMapperConfig;
import io.restassured.config.RestAssuredConfig;
import io.smallrye.jwt.build.Jwt;
import io.smallrye.jwt.util.KeyUtils;

@QuarkusTestResource(MockServerTestResource.class)
public abstract class AbstractTest {

    private static final List<String> MOCK_IDS = new ArrayList<>();

    protected static final String HEADER_APM_TOKEN = "apm-principal-token";

    protected KeycloakTestClient keycloakTestClient = new KeycloakTestClient();

    static {
        RestAssured.config = RestAssuredConfig.config().objectMapperConfig(
                ObjectMapperConfig.objectMapperConfig().jackson2ObjectMapperFactory(
                        (cls, charset) -> {
                            ObjectMapper objectMapper = new ObjectMapper();
                            objectMapper.registerModule(new JavaTimeModule());
                            objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
                            return objectMapper;
                        }));
    }

    protected void addExpectation(Expectation[] exceptions) {
        for (Expectation e : List.of(exceptions)) {
            MOCK_IDS.add(e.getId());
        }

    }

    protected void clearExpectation(MockServerClient client) {
        MOCK_IDS.forEach(x -> {
            try {
                client.clear(x);
            } catch (Exception ex) {
                //  mockId not existing
            }
        });
        MOCK_IDS.clear();
    }

    public static String createToken(String orgId) {
        JsonObjectBuilder claims = Json.createObjectBuilder();
        claims.add(Claims.preferred_username.name(), "test");
        claims.add(Claims.sub.name(), "test");
        claims.add("orgId", orgId);
        return Jwt.claims(claims.build()).sign(KEY);
    }

    static final PrivateKey KEY = createKey();

    static PrivateKey createKey() {
        try {
            return KeyUtils.generateKeyPair(2048).getPrivate();
        } catch (NoSuchAlgorithmException ex) {
            throw new RuntimeException("Error generate private key", ex);
        }
    }

}


```

## Folder: onecx-parameter-svc/src/test/resources/data (6 files)

### File: onecx-parameter-svc/src/test/resources/data/history-testdata.xml

```xml

<?xml version="1.0" encoding="UTF-8"?>
<dataset>
    <HISTORY creationdate="2021-03-24" guid="1" optlock="1" app_id="access-mgmt" product_name="access-mgmt-product" name="ENGINE" used_value="&quot;JBPM&quot;" default_value="&quot;JBPM&quot;" interval_start="2019-03-24" interval_end="2019-03-23" tenant_id="tenant-100" />
    <HISTORY creationdate="2021-06-24" guid="2" optlock="1" app_id="access-mgmt" product_name="access-mgmt-product" name="ENGINE" used_value="&quot;KOGITO&quot;" default_value="&quot;JBPM&quot;" interval_start="2019-03-25" interval_end="2019-03-26" tenant_id="tenant-100" />
    <HISTORY creationdate="2021-07-24" guid="3" optlock="1" app_id="app1" product_name="p1" name="key1" used_value="&quot;JBPM&quot;" default_value="&quot;JBPM&quot;" interval_start="2019-03-24" interval_end="2019-03-23" tenant_id="tenant-100" />
    <HISTORY creationdate="2021-08-24" guid="4" optlock="1" app_id="app2" product_name="p2" name="key2" used_value="&quot;KOGITO&quot;" default_value="&quot;JBPM&quot;" interval_start="2019-03-25" interval_end="2019-03-26" tenant_id="tenant-100" />
    <HISTORY creationdate="2022-03-01" guid="5" optlock="1" app_id="access-mgmt" product_name="access-mgmt-product" name="ENGINE" used_value="&quot;JBPM&quot;" default_value="J&quot;BPM&quot;" interval_start="2019-03-24" interval_end="2019-03-23" tenant_id="tenant-100" />
    <HISTORY creationdate="2022-03-02" guid="6" optlock="1" app_id="access-mgmt" product_name="access-mgmt-product" name="ENGINE" used_value="&quot;KOGITO&quot;" default_value="&quot;JBPM&quot;" interval_start="2019-03-25" interval_end="2019-03-26" tenant_id="tenant-100" />
    <HISTORY creationdate="2022-03-10" guid="7" optlock="1" app_id="app1" product_name="p1" name="key1" used_value="&quot;JBPM&quot;" default_value="&quot;JBPM&quot;" interval_start="2019-03-24" interval_end="2019-03-23" tenant_id="tenant-100" />
    <HISTORY creationdate="2022-03-10" guid="8" optlock="1" app_id="app2" product_name="p2" name="key2" used_value="&quot;KOGITO&quot;" default_value="&quot;JBPM&quot;" interval_start="2019-03-25" interval_end="2019-03-26" tenant_id="tenant-100" />

    <HISTORY creationdate="2122-03-10" guid="100" optlock="1" app_id="app2" product_name="p2" name="key2" used_value="&quot;KOGITO&quot;" default_value="&quot;JBPM&quot;" interval_start="2019-03-25" interval_end="2019-03-26" tenant_id="tenant-100" />
    <HISTORY creationdate="2121-03-10" guid="101" optlock="1" app_id="app2" product_name="p2" name="key2" used_value="&quot;KOGITO&quot;" default_value="&quot;JBPM&quot;" interval_start="2019-03-25" interval_end="2019-03-26" tenant_id="tenant-100" />
    <!-- different tenant -->
    <HISTORY creationdate="2022-03-10" guid="102" optlock="1" app_id="app2" product_name="p2" name="key2" used_value="&quot;KOGITO&quot;" default_value="&quot;JBPM&quot;" interval_start="2019-03-25" interval_end="2019-03-26" tenant_id="tenant-500" />

</dataset>

```

### File: onecx-parameter-svc/src/test/resources/data/operator-testdata.xml

```xml

<?xml version="1.0" encoding="UTF-8"?>
<dataset>
    <PARAMETER guid="GUID6" optlock="1" app_id="app1" product_name="product1" display_name="name1" name="name1" description="import parameter" IMPORT_VALUE="&quot;import-value&quot;" tenant_id="tenant-100" operator="true"/>
    <PARAMETER guid="GUID7" optlock="1" app_id="app1" product_name="product1" display_name="name2" name="name2" description="import parameter" IMPORT_VALUE="" tenant_id="tenant-100" operator="false"/>
</dataset>

```

### File: onecx-parameter-svc/src/test/resources/data/parameters-dao-testdata.xml

```xml

<?xml version="1.0" encoding="UTF-8"?>
<dataset>
    <PARAMETER guid="GUID1" optlock="1" app_id="app1" product_name="p1" display_name="param" name="param" value="${STRING_ENV_VARIABLE}/test" description="param example" tenant_id="tenant-100" operator="false"/>
    <PARAMETER guid="GUID2" optlock="1" app_id="app1" product_name="p1" display_name="integer_param" name="integer_param" value="${INTEGER_ENV_VARIABLE}${INTEGER_ENV_VARIABLE}" description="integer param example" tenant_id="tenant-100" operator="false"/>
    <PARAMETER guid="GUID3" optlock="1" app_id="app1" product_name="p1" display_name="boolean_param" name="boolean_param" value="${BOOLEAN_ENV_VARIABLE}" description="boolean param example" tenant_id="tenant-100" operator="false"/>
</dataset>

```

### File: onecx-parameter-svc/src/test/resources/data/parameters-eximdata.xml

```xml

<?xml version="1.0" encoding="UTF-8"?>
<dataset>
    <PARAMETER guid="GUID6" optlock="1" app_id="import-app" product_name="import-product" display_name="importParam" name="importParam" description="import parameter" IMPORT_VALUE="&quot;import-value&quot;" tenant_id="tenant-100" operator="true"/>
    <PARAMETER guid="GUID1" optlock="1" app_id="import-app" product_name="import-product2" display_name="importParam2" name="importParam2" description="import parameter2" IMPORT_VALUE="{&quot;data&quot;:&quot;import-value&quot;}" tenant_id="tenant-100" operator="true"/>
    <PARAMETER guid="GUID61" optlock="1" app_id="import-app" product_name="import-product" display_name="importParam" name="importParam3" description="import parameter" IMPORT_VALUE="&quot;import-value-200&quot;" tenant_id="tenant-100" operator="true"/>
</dataset>

```

### File: onecx-parameter-svc/src/test/resources/data/parameters-importdata.xml

```xml

<?xml version="1.0" encoding="UTF-8"?>
<dataset>
    <PARAMETER guid="GUID6" optlock="1" app_id="import-app" product_name="import-product" display_name="importParam" name="importParam" description="import parameter" IMPORT_VALUE="&quot;import-value&quot;" tenant_id="tenant-100" operator="true"/>
    <PARAMETER guid="GUID1" optlock="1" app_id="import-app" product_name="import-product" display_name="importParam2" name="importParam2" description="import parameter2" IMPORT_VALUE="{&quot;data&quot;:&quot;import-value&quot;}" tenant_id="tenant-100" operator="true"/>
    <PARAMETER guid="GUID61" optlock="1" app_id="import-app" product_name="import-product" display_name="importParam" name="importParam" description="import parameter" IMPORT_VALUE="&quot;import-value-200&quot;" tenant_id="tenant-200" operator="true"/>
</dataset>

```

### File: onecx-parameter-svc/src/test/resources/data/parameters-testdata.xml

```xml

<?xml version="1.0" encoding="UTF-8"?>
<dataset>
    <PARAMETER guid="GUID1" optlock="1" app_id="app1" product_name="p1" display_name="param" name="param" value="&quot;${STRING_ENV_VARIABLE}/test&quot;" description="param example" tenant_id="tenant-100" operator="false"/>
    <PARAMETER guid="GUID2" optlock="1" app_id="app1" product_name="p1" display_name="integer_param" name="integer_param" value="&quot;${INTEGER_ENV_VARIABLE}${INTEGER_ENV_VARIABLE}&quot;" description="integer param example" tenant_id="tenant-100" operator="false"/>
    <PARAMETER guid="GUID3" optlock="1" app_id="app1" product_name="p1" display_name="boolean_param" name="boolean_param" value="&quot;${BOOLEAN_ENV_VARIABLE}&quot;" description="boolean param example" tenant_id="tenant-100" operator="false"/>
    <PARAMETER guid="GUID4" optlock="1" app_id="app1" product_name="p1" display_name="cyclic_param" name="cyclic_param" value="&quot;${CYCLIC_ENV_VARIABLE}&quot;" description="cyclic param example" tenant_id="tenant-100" operator="false"/>
    <PARAMETER guid="GUID5" optlock="1" app_id="app1" product_name="p1" display_name="existStringParam" name="existStringParam" value="&quot;Existing&quot;" description="existing parameter" tenant_id="tenant-100" operator="false"/>


    <PARAMETER guid="111" optlock="1" app_id="access-mgmt" product_name="access-mgmt-product" display_name="Engine" name="ENGINE" value="&quot;KOGITO&quot;" tenant_id="tenant-100" operator="false"/>

    <HISTORY creationdate="2022-03-10" guid="1" optlock="1" app_id="access-mgmt" product_name="access-mgmt-product" name="ENGINE" used_value="&quot;JBPM&quot;" default_value="&quot;JBPM&quot;" interval_start="2019-03-24" interval_end="2019-03-23" tenant_id="tenant-100" />
    <HISTORY creationdate="2022-03-10" guid="2" optlock="1" app_id="access-mgmt" product_name="access-mgmt-product" name="ENGINE" used_value="&quot;KOGITO&quot;" default_value="&quot;JBPM&quot;" interval_start="2019-03-25" interval_end="2019-03-26" tenant_id="tenant-100" />

    <PARAMETER guid="112" optlock="1" app_id="access-mgmt" product_name="access-mgmt-product" name="COUNTER" tenant_id="tenant-100" operator="false" />
    <PARAMETER guid="113" optlock="1" app_id="portal-server" product_name="portal-server-product" name="RETURN_PORTAL_INFO" value="true" tenant_id="tenant-100" operator="false"/>
    <PARAMETER guid="114" optlock="1" app_id="order-mgmt" product_name="order-mgmt-product" name="UNKNOWN_PARAMETER" tenant_id="tenant-100" operator="true"/>

    <HISTORY creationdate="2022-03-10" guid="h1" optlock="1" app_id="app1" product_name="p1" name="key1" used_value="&quot;JBPM&quot;" default_value="&quot;JBPM&quot;" interval_start="2019-03-24" interval_end="2019-03-23" instance_id="i1" tenant_id="tenant-100"/>
    <HISTORY creationdate="2022-03-10" guid="h2" optlock="1" app_id="app2" product_name="p2" name="key2" used_value="&quot;KOGITO&quot;" default_value="&quot;JBPM&quot;" interval_start="2019-03-25" interval_end="2019-03-26" instance_id="i2" tenant_id="tenant-100"/>
    <HISTORY creationdate="2022-03-10" guid="h21" optlock="1" app_id="app2" product_name="p2" name="key2" used_value="&quot;KOGITO&quot;" default_value="&quot;JBPM&quot;" interval_start="2019-03-25" interval_end="2019-03-26" instance_id="i2" tenant_id="tenant-100"/>
    <HISTORY creationdate="2022-03-10" guid="h22" optlock="1" app_id="app2" product_name="p2" name="key2" used_value="&quot;KOGITO&quot;" default_value="&quot;JBPM&quot;" interval_start="2019-03-25" interval_end="2019-03-26" instance_id="i3" tenant_id="tenant-100"/>
</dataset>

```

## Folder: onecx-parameter-svc/src/test/resources (1 files)

### File: onecx-parameter-svc/src/test/resources/mockserver.properties

```properties

mockserver.initializationJsonPath=/mockserver/*.json
# watch changes in the file
mockserver.watchInitializationJson=true


# Certificate Generation
# dynamically generated CA key pair (if they don't already exist in specified directory)
mockserver.dynamicallyCreateCertificateAuthorityCertificate=true
# save dynamically generated CA key pair in working directory
mockserver.directoryToSaveDynamicSSLCertificate=.
# certificate domain name (default "localhost")
mockserver.sslCertificateDomainName=localhost
# comma separated list of ip addresses for Subject Alternative Name domain names (default empty list)
mockserver.sslSubjectAlternativeNameDomains=www.example.com,www.another.com
# comma separated list of ip addresses for Subject Alternative Name ips (default empty list)
mockserver.sslSubjectAlternativeNameIps=127.0.0.1

```

## Folder: onecx-parameter-svc/src/test/resources/mockserver (1 files)

### File: onecx-parameter-svc/src/test/resources/mockserver/ping.json

```json

[
  {
    "id": "-1",
    "httpRequest": {
      "path": "/ping"
    },
    "httpResponse": {
      "body": {
        "type": "JSON",
        "json": {},
        "contentType": "application/json"
      }
    }
  }
]


```


