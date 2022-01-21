package com.github.rasmussaks.hoardr.graphql.config

import graphql.ExecutionResult
import graphql.execution.AsyncExecutionStrategy
import graphql.execution.ExecutionContext
import graphql.execution.ExecutionStrategyParameters
import graphql.scalars.ExtendedScalars
import org.springframework.boot.autoconfigure.graphql.GraphQlSourceBuilderCustomizer
import org.springframework.graphql.execution.GraphQlSource
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.util.concurrent.CompletableFuture


@Component
class GraphQLConfiguration(
    private val strategy: AsyncTransactionalExecutionStrategy
) : GraphQlSourceBuilderCustomizer {
    override fun customize(builder: GraphQlSource.Builder) {
        builder.configureGraphQl {
            it.queryExecutionStrategy(strategy)
            it.mutationExecutionStrategy(strategy)
        }
        builder.configureRuntimeWiring {
            it.scalar(ExtendedScalars.Json)
            it.scalar(ExtendedScalars.DateTime)
        }
    }
}

@Component
class AsyncTransactionalExecutionStrategy : AsyncExecutionStrategy() {
    @Transactional
    override fun execute(
        executionContext: ExecutionContext,
        parameters: ExecutionStrategyParameters
    ): CompletableFuture<ExecutionResult> {
        return super.execute(executionContext, parameters)
    }
}
